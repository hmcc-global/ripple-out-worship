import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import { JWT_MAX_AGE, JWT_MIN_AGE } from '../constants';
import { User } from '../models/ownership.model';
import { OwnershipAuthSchema } from '../types/ownership.types';

const hashInput = async function (input: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(input, salt);
};

const validateInput = function (input: string, hashedInput: string): Promise<boolean> {
  return bcrypt.compare(input, hashedInput);
};

const generateRandomToken = (length: number): string => {
  return crypto.randomBytes(length || 32).toString('hex');
};

const generateJwt = (
  userId: Types.ObjectId,
  email: string,
  accessType: string,
  isRememberPassword: boolean
): string => {
  try {
    return jwt.sign(
      {
        id: userId,
        emailAddress: email,
        accessType: accessType,
      },
      process.env.JWT_KEY as jwt.Secret,
      { expiresIn: isRememberPassword ? JWT_MAX_AGE : JWT_MIN_AGE }
    );
  } catch (error: any) {
    throw new Error('Invalid token or no authentication present');
  }
};

const verifyJwt = async (token: string): Promise<OwnershipAuthSchema> => {
  if (token == null || token === '') {
    throw new Error('Unauthorized');
  }

  try {
    const valid: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_KEY as jwt.Secret
    ) as jwt.JwtPayload;
    if (valid == null) throw new Error('Forbidden');

    // at this point should return a user object
    // with id, email and accessType
    const userObj: OwnershipAuthSchema | null = await User.findOne({ _id: valid.id })
      .select('-createdAt -updatedAt -password')
      .exec();

    if (!userObj) throw new Error('Unauthorized');

    return userObj;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};

const verifyGoogleToken = async (client: OAuth2Client, code: string): Promise<TokenPayload> => {
  try {
    const { tokens } = await client.getToken(code);

    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: tokens.id_token || '',
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();

    if (payload === undefined) {
      throw new Error('Google token verification failed');
    } else {
      return payload;
    }
  } catch (error) {
    throw new Error('Google token verification failed');
  }
};

export { hashInput, validateInput, generateRandomToken, generateJwt, verifyJwt, verifyGoogleToken };
