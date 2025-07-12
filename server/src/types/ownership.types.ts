import { Types } from 'mongoose';
import { MongoInjectedFields } from './mongo.types';

type OwnershipSchema = {
  userId: string;
  groupIds?: Types.Array<Types.ObjectId>;
  setlistIds?: Types.Array<Types.ObjectId>;
  isDeleted: boolean;
};

type OwnershipDocument = OwnershipSchema & MongoInjectedFields;

type OwnershipPublicDocument = Omit<OwnershipDocument, 'password'>;

type OwnershipAuthSchema = Omit<OwnershipDocument, 'createdAt' | 'updatedAt'>;

export { OwnershipSchema, OwnershipAuthSchema, OwnershipDocument, OwnershipPublicDocument };
