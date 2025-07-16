import { Types } from 'mongoose';
import { MongoInjectedFields } from './mongo.types';

type OwnershipSchema = {
  userId: string;
  fullName: string;
  email: string;
  groupIds?: Types.Array<Object>;
  setlistIds?: Types.Array<Object>;
  isDeleted: boolean;
};

type OwnershipDocument = OwnershipSchema & MongoInjectedFields;

type OwnershipPublicDocument = Omit<OwnershipDocument, 'password'>;

type OwnershipAuthSchema = Omit<OwnershipDocument, 'createdAt' | 'updatedAt'>;

export { OwnershipSchema, OwnershipAuthSchema, OwnershipDocument, OwnershipPublicDocument };
