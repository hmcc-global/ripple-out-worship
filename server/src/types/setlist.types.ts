import { Types } from 'mongoose';
import { MongoInjectedFields } from './mongo.types';
import { SongSetlistSchema } from './song.types';

type SetlistSchema = {
  name: string;
  date: Date;
  createdBy: Types.ObjectId;
  songs: Types.Array<SongSetlistSchema>;
  lastUpdatedBy: Types.ObjectId;
  publicLink: string;
  groupIds: Types.Array<Types.ObjectId>;
  isDeleted: boolean;
};

type SetlistDocument = SetlistSchema & MongoInjectedFields;

export { SetlistSchema, SetlistDocument };
