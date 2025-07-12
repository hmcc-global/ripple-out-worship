import { Types } from 'mongoose';
import { MongoInjectedFields } from './mongo.types';

type GroupSchema = {
  groupName: string;
  ownerships: Types.Array<Types.ObjectId>;
  setlistIds: Types.Array<Types.ObjectId>;
  createdBy: Types.ObjectId;
  lastUpdatedBy: Types.ObjectId;
  createdAt: Date;
  lastUpdatedAt: Date;
  isDeleted: boolean;
};

type GroupDocument = GroupSchema & MongoInjectedFields;

export { GroupSchema, GroupDocument };
