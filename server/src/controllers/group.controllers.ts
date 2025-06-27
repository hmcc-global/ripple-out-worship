import { Request, RequestHandler, Response } from 'express';
import { Group } from '../models/group.model';
import { GroupDocument } from '../types/group.types';

const sendResponse = (
  res: Response,
  statusCode: number,
  payload: GroupDocument[] | GroupDocument | string
) => {
  return res.status(statusCode).json(payload);
};

const createGroup: RequestHandler = async (req: Request, res: Response) => {
  const { ...toCreate }: GroupDocument = req.body;

  // Check if any fields are present. MongoDB will throw an error
  // if no fields are present or if a required field is missing
  if (Object.keys(toCreate).length > 0) {
    try {
      const data: GroupDocument = await Group.create(toCreate);

      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, 'Group not created');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const getGroup: RequestHandler = async (req: Request, res: Response) => {
  const groupId = req.query.id;

  try {
    if (groupId) {
      const data: GroupDocument | null = await Group.findOne({
        _id: groupId,
        isDeleted: false,
      });

      if (data) {
        return sendResponse(res, 200, data);
      } else {
        return sendResponse(res, 404, 'Group not found');
      }
    }
    // If no groupId, get all groups
    const data: GroupDocument[] = await Group.find({ isDeleted: false });

    if (data.length > 0) {
      return sendResponse(res, 200, data);
    } else {
      return sendResponse(res, 404, 'No groups found');
    }
  } catch (error: any) {
    return sendResponse(res, 500, error?.message);
  }
};

const updateGroup: RequestHandler = async (req: Request, res: Response) => {
  const { id: groupId, ...toUpdate } = req.body;

  // Update group by id with fields to update
  if (groupId && Object.keys(toUpdate).length > 0) {
    try {
      const updatedGroup = await Group.updateOne(
        { _id: groupId, isDeleted: false },
        { $set: toUpdate }
      );

      if (updatedGroup) {
        sendResponse(res, 200, 'Group updated');
      } else {
        sendResponse(res, 404, 'Group not updated');
      }
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

const deleteGroup: RequestHandler = async (req: Request, res: Response) => {
  const { id: groupId } = req.params;

  // Soft delete group by id
  if (groupId) {
    try {
      await Group.updateOne({ _id: groupId, isDeleted: false }, { $set: { isDeleted: true } });

      sendResponse(res, 200, 'Group deleted');
    } catch (error: any) {
      sendResponse(res, 500, error?.message);
    }
  } else {
    sendResponse(res, 400, 'Missing required fields');
  }
};

export { createGroup, getGroup, updateGroup, deleteGroup };
