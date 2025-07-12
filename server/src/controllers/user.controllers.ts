import { Request, RequestHandler, Response } from 'express';
import User from '../models/user.model';

const sendResponse = (res: Response, statusCode: number, payload: any) => {
  return res.status(statusCode).json(payload);
};

const createUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { ...toCreate } = req.body;

  if (Object.keys(toCreate).length > 0) {
    try {
      const data = await User.create(toCreate);

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, { error: 'User not created' });
      }
    } catch (error: any) {
      sendResponse(res, 500, { error: error.message });
    }
  } else {
    sendResponse(res, 400, { error: 'Missing required fields' });
  }
};

const getUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { id: userId } = req.params;

  if (userId) {
    try {
      const data = await User.findOne({ _id: userId }).exec();

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, { error: 'User not found' });
      }
    } catch (error: any) {
      sendResponse(res, 500, { error: error.message });
    }
  } else {
    try {
      const data = await User.find().exec();

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, { error: 'Users not found' });
      }
    } catch (error: any) {
      sendResponse(res, 500, { error: error.message });
    }
  }
};

const updateUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { id: userId, ...toUpdate } = req.body;

  if (userId && Object.keys(toUpdate).length > 0) {
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, toUpdate, {
        upsert: true,
        new: true,
      });

      if (updatedUser) {
        sendResponse(res, 200, updatedUser);
      } else {
        sendResponse(res, 404, { error: 'User not found' });
      }
    } catch (error: any) {
      sendResponse(res, 500, { error: error.message });
    }
  } else {
    sendResponse(res, 400, { error: 'Missing required fields' });
  }
};

const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { id: userId } = req.params;

  if (userId) {
    try {
      const data = await User.findOneAndDelete({ _id: userId });

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, { error: 'User not found' });
      }
    } catch (error: any) {
      sendResponse(res, 500, { error: error.message });
    }
  } else {
    sendResponse(res, 400, { error: 'Missing required fields' });
  }
};

export { createUser, getUser, updateUser, deleteUser };
