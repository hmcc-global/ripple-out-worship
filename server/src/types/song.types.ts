import { Types } from 'mongoose';
import { MongoInjectedFields } from './mongo.types';

type SongSchema = {
  title: string;
  tempo: Types.Array<string>;
  originalKey: string;
  recommendedKeys: Types.Array<string>;
  themes: Types.Array<string>;
  artist: string;
  year: string;
  code: string;
  createdBy: Types.ObjectId;
  lastUpdatedBy: Types.ObjectId;
  isVerified: boolean;
  timeSignature: Types.Array<string>;
  simplifiedChordLyrics: string;
  chordLyrics: string;
  isDeleted: boolean;
};

type SongDocument = SongSchema & MongoInjectedFields;

type SongSetlistSchema = SongDocument & {
  key: string;
  sequence: number;
};

export { SongSchema, SongDocument, SongSetlistSchema };
