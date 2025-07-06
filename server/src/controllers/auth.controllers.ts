import { Request, RequestHandler, Response } from 'express';
import { User } from '../models/ownership.model';
import { ResetPwdToken } from '../models/auth.model';
import { UserSchema, UserDocument, UserAuthSchema } from '../types/ownership.types';
import {
  hashInput,
  validateInput,
  generateRandomToken,
  generateJwt,
  verifyGoogleToken,
  verifyJwt,
} from '../utils/auth.utils';
import {
  CredentialsSchema,
  GooglePayloadSchema,
  ResetPwdTokenSchema,
  ResetPwdTokenDocument,
} from '../types/auth.types';
import { OAuth2Client } from 'google-auth-library';
import { sendTemplateEmail } from '../utils/email.utils';
import { PWD_RESET_TOKEN_TTL } from '../constants';

const sendResponse = (
  res: Response,
  statusCode: number,
  payload: (UserDocument | GooglePayloadSchema | UserAuthSchema | string) & { token?: string }
) => {
  return res.status(statusCode).json(payload);
};

const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const credentials: CredentialsSchema = req.body;

  if (
    Object.keys(credentials).length > 0 &&
    credentials.email &&
    credentials.password !== '' &&
    credentials.password &&
    credentials.isRememberPassword !== undefined &&
    credentials.isRememberPassword !== null
  ) {
    try {
      const userRecord: UserDocument | null = await User.findOne({
        email: credentials.email.toLowerCase(),
      });

      if (!userRecord) {
        sendResponse(res, 401, 'Invalid login credentials');
        return;
      }

      const isPasswordValid = await validateInput(credentials.password, userRecord.password);

      if (isPasswordValid) {
        const token = await generateJwt(
          userRecord._id,
          userRecord.email,
          userRecord.accessType,
          credentials.isRememberPassword
        );

        sendResponse(res, 200, { token: token, ...userRecord });
      } else {
        sendResponse(res, 401, 'Invalid login credentials');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 422, 'Missing required fields');
  }
};

const loginGoogle: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { responseCode } = req.body;

  if (responseCode) {
    const client: OAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    try {
      const data = await verifyGoogleToken(client, responseCode);
      if (data && data.email && data.name) {
        const { email } = data;

        const newEmail = email.toLowerCase();

        const userRecord: UserDocument = await User.findOne({ email: newEmail }).exec();
        if (userRecord) {
          const token = await generateJwt(
            userRecord._id,
            userRecord.email,
            userRecord.accessType,
            true
          ); // always remember password for google login

          sendResponse(res, 200, { token: token, ...userRecord });

          // Create new user from google
        } else if (!userRecord) {
          const newRecord = {
            email: newEmail,
            fullName: data.name,
            password: '',
          };
          // create user record
          const newUser: UserDocument = await User.create(newRecord);
          const token = await generateJwt(newUser._id, newUser.email, newUser.accessType, true); // always remember password for google login
          sendResponse(res, 200, { token: token, ...newUser });
        } else {
          sendResponse(res, 401, 'Email not found, failed to register');
        }
      }
    } catch (error: any) {
      console.error('Error creating new user:', error);
      if (error.name === 'ValidationError') {
        sendResponse(res, 422, 'Invalid user data');
      } else {
        sendResponse(res, 500, 'Failed to create new user');
      }
    }
  } else {
    sendResponse(res, 422, 'Missing Token ID');
  }
};

const signup: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { ...toCreate }: UserSchema = req.body;

  if (
    Object.keys(toCreate).length > 0 &&
    toCreate.password &&
    toCreate.email &&
    toCreate.fullName
  ) {
    try {
      toCreate.email = toCreate.email.toLowerCase();
      toCreate.password = await hashInput(toCreate.password);
      const data: UserDocument = await User.create(toCreate);

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'User account was not successfully created');
      }
    } catch (error: any) {
      if (error?.name === 'ValidationError') {
        sendResponse(res, 422, 'Missing required fields');
      } else if (error?.code === 11000) {
        sendResponse(res, 409, 'The provided email address is already in use');
      } else {
        sendResponse(res, 500, error?.message);
      }
    }
  } else {
    sendResponse(res, 422, 'Missing required fields');
  }
};

const forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (email) {
    const newEmail = email.toLowerCase();

    const userRecord: UserDocument = await User.findOne({ email: newEmail }).exec();
    if (!userRecord) {
      sendResponse(
        res,
        200,
        'The email address might have matched a user in the database.  (If so, a recovery email was sent.)'
      );
      return;
    }

    // Delete any existing reset password tokens for this email to avoid breaking unique constraint
    ResetPwdToken.findOneAndDelete({ email: newEmail }).exec();

    const resetToken = generateRandomToken(32);
    const hashedResetToken = await hashInput(resetToken);

    const resetPwdToken: ResetPwdTokenSchema = {
      email: newEmail,
      token: hashedResetToken,
      expireAt: new Date(Date.now() + PWD_RESET_TOKEN_TTL), // expires 24 hours from time of token creation
    };

    const data: ResetPwdTokenDocument = await ResetPwdToken.create(resetPwdToken);

    if (!data) {
      sendResponse(res, 500, 'Failed to create reset password token');
      return;
    }

    const resetPwdUrl = `${process.env.BASE_URL}/password/new?email=${newEmail}&token=${resetToken}`;

    const templateData = {
      fullName: userRecord?.fullName,
      resetUrl: resetPwdUrl,
    };

    try {
      await sendTemplateEmail(
        newEmail,
        'Password Reset Instructions',
        'email-reset-password',
        templateData,
        'layout-email'
      );
      sendResponse(res, 200, 'Successfully sent reset password email!');
    } catch (error: any) {
      sendResponse(res, 500, 'Failed to process reset password request');
    }
  } else {
    sendResponse(res, 422, 'Missing required fields');
  }
};

const resetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;

  if (email && token && password) {
    try {
      const resetPwdTokenRecord: ResetPwdTokenDocument | null = await ResetPwdToken.findOne({
        email: email,
      });

      if (!resetPwdTokenRecord) {
        sendResponse(res, 401, 'No password reset token found');
        return;
      }

      const isTokenValid = await validateInput(token, resetPwdTokenRecord.token);

      // Token may have been used but not expired yet
      if (
        isTokenValid &&
        !resetPwdTokenRecord.isUsed &&
        resetPwdTokenRecord.expireAt &&
        resetPwdTokenRecord.expireAt >= new Date()
      ) {
        await User.updateOne(
          { email: resetPwdTokenRecord.email },
          { $set: { password: await hashInput(password) } }
        );

        await ResetPwdToken.updateOne({ email: email }, { $set: { isUsed: true } });

        sendResponse(res, 200, 'Successfully reset password!');
      } else {
        sendResponse(res, 401, 'Invalid or expired reset password token');
      }
    } catch (error: any) {
      console.log(error);
      sendResponse(res, 500, 'Failed to process reset password request');
    }
  } else {
    sendResponse(res, 422, 'Missing required fields');
  }
};

const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (token && token !== '') {
    try {
      const validUserObject: UserAuthSchema = await verifyJwt(token);
      sendResponse(res, 200, validUserObject);
    } catch (error: any) {
      sendResponse(res, 401, 'Invalid token');
    }
  } else {
    sendResponse(res, 401, 'Unauthorized');
  }
};

export { login, loginGoogle, signup, forgotPassword, resetPassword, verifyToken };
