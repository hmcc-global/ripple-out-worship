import { Request, RequestHandler, Response } from 'express';
import { User } from '../models/ownership.model';
import { UserDocument, UserPublicDocument } from '../types/ownership.types';
import { hashInput, validateInput } from '../utils/auth.utils';

const sendResponse = (
  res: Response,
  statusCode: number,
  payload: UserPublicDocument[] | UserPublicDocument | string
) => {
  return res.status(statusCode).json(payload);
};

const createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { ...toCreate }: UserDocument = req.body;

  if (Object.keys(toCreate).length > 0) {
    try {
      toCreate.password = await hashInput(toCreate.password);
      const data: UserDocument = await User.create(toCreate);

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'User not created');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const getUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.query;

  if (userId) {
    try {
      const data: UserPublicDocument | null = await User.findOne({
        _id: userId,
        isDeleted: false,
      });

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'User not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    try {
      const data: UserPublicDocument[] = await User.find({ isDeleted: false }).select('-password');

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Users not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  }
};

const updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: userId, ...toUpdate } = req.body;
  if (userId && Object.keys(toUpdate).length > 0) {
    try {
      const data: UserDocument = await User.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { $set: toUpdate },
        {
          upsert: true,
          new: true,
        }
      );

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'User not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.params;

  if (userId) {
    try {
      await User.updateOne({ _id: userId, isDeleted: false }, { $set: { isDeleted: true } });
      sendResponse(res, 200, 'User successfully deleted');
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const changePassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id, currentPassword, newPassword } = req.body;

  if (id && currentPassword && newPassword) {
    try {
      const userRecord = await User.findOne({ _id: id, isDeleted: false });
      if (!userRecord) {
        sendResponse(res, 401, 'No userId found');
        return;
      }

      const isPasswordValid = await validateInput(currentPassword, userRecord.password);
      const hashNewPassword = await hashInput(newPassword);

      if (isPasswordValid) {
        await User.updateOne(
          { _id: id, isDeleted: false },
          {
            $set: { password: hashNewPassword },
          }
        );
        const newUserRecord = await User.findOne({ _id: id, isDeleted: false });
        sendResponse(res, 200, newUserRecord);
      } else {
        sendResponse(res, 401, 'Invalid Password');
      }
    } catch (error: any) {
      sendResponse(res, 500, 'Failed to process change password request');
    }
  } else {
    sendResponse(res, 422, 'Missing required fields');
  }
};

export { createUser, getUser, updateUser, deleteUser, changePassword };
