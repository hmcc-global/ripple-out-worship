import { Types } from 'mongoose';
import { MongoInjectedFields } from './mongo.types';

type OwnershipGroup = {
  id: string;
  name: string;
  createdAt: string;
};
type OwnershipSetlist = OwnershipGroup;

type OwnershipSchema = {
  userId: string;
  fullName: string;
  accessType: string;
  groupIds?: Types.Array<OwnershipGroup>;
  setlistIds?: Types.Array<OwnershipSetlist>;
  isDeleted: boolean;
};

type OwnershipDocument = OwnershipSchema & MongoInjectedFields;

type OwnershipPublicDocument = Omit<OwnershipDocument, 'password'>;

type OwnershipAuthSchema = Omit<OwnershipDocument, 'createdAt' | 'updatedAt'>;

export { OwnershipSchema, OwnershipAuthSchema, OwnershipDocument, OwnershipPublicDocument };
