import { Request, RequestHandler, Response } from 'express';
import User from '../models/user.model';

// Common response helper
const sendResponse = (res: Response, statusCode: number, payload: any) => {
  return res.status(statusCode).json(payload);
};

// Common error handler for async operations
const handleAsyncOperation = async (
  res: Response, 
  operation: () => Promise<any>,
  successStatus: number = 200,
  notFoundMessage?: string
) => {
  try {
    const result = await operation();
    
    if (result) {
      sendResponse(res, successStatus, result);
    } else {
      sendResponse(res, 404, { error: notFoundMessage || 'Resource not found' });
    }
  } catch (error: any) {
    sendResponse(res, 500, { error: error.message });
  }
};

const createUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { ...toCreate } = req.body;

  if (Object.keys(toCreate).length === 0) {
    return sendResponse(res, 400, { error: 'Missing required fields' });
  }

  await handleAsyncOperation(
    res,
    () => User.create(toCreate),
    201,
    'User not created'
  );
};

const getUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { id: userId } = req.params;

  if (userId) {
    await handleAsyncOperation(
      res,
      () => User.findOne({ _id: userId }).exec(),
      200,
      'User not found'
    );
  } else {
    await handleAsyncOperation(
      res,
      () => User.find().exec(),
      200,
      'Users not found'
    );
  }
};

const updateUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { id: userId, ...toUpdate } = req.body;

  if (!userId || Object.keys(toUpdate).length === 0) {
    return sendResponse(res, 400, { error: 'Missing required fields' });
  }

  await handleAsyncOperation(
    res,
    () => User.findOneAndUpdate({ _id: userId }, toUpdate, {
      upsert: true,
      new: true,
    }),
    200,
    'User not found'
  );
};

const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const { id: userId } = req.params;

  if (!userId) {
    return sendResponse(res, 400, { error: 'Missing required fields' });
  }

  await handleAsyncOperation(
    res,
    () => User.findOneAndDelete({ _id: userId }),
    200,
    'User not found'
  );
};

export { createUser, getUser, updateUser, deleteUser };
