import { Request, RequestHandler, Response } from 'express';
import { Ownership } from '../models/ownership.model';
import { OwnershipDocument, OwnershipPublicDocument } from '../types/ownership.types';

const sendResponse = (
  res: Response,
  statusCode: number,
  payload: OwnershipPublicDocument[] | OwnershipPublicDocument | string
) => {
  return res.status(statusCode).json(payload);
};

const createOwnership: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { ...toCreate }: OwnershipDocument = req.body;

  if (Object.keys(toCreate).length > 0) {
    try {
      const data: OwnershipDocument = await Ownership.create(toCreate);

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Ownership not created');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const getOwnership: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (userId) {
    try {
      const data: OwnershipPublicDocument | null = await Ownership.findOne({
        userId: userId,
        isDeleted: false,
      });

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Ownership not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    try {
      const data: OwnershipPublicDocument[] = await Ownership.find({ isDeleted: false });

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Ownerships not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  }
};

const updateOwnership: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: ownershipId, ...toUpdate } = req.body;
  if (ownershipId && Object.keys(toUpdate).length > 0) {
    try {
      const data: OwnershipDocument = await Ownership.findOneAndUpdate(
        { _id: ownershipId, isDeleted: false },
        { $set: toUpdate },
        {
          upsert: true,
          new: true,
        }
      );

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Ownership not found');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const deleteOwnership: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id: ownershipId } = req.params;

  if (ownershipId) {
    try {
      await Ownership.updateOne(
        { _id: ownershipId, isDeleted: false },
        { $set: { isDeleted: true } }
      );
      sendResponse(res, 200, 'Ownership successfully deleted');
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

export { createOwnership, getOwnership, updateOwnership, deleteOwnership };
