import { Schema, model, models, Types } from 'mongoose';
import { SetlistSchema } from '../types/setlist.types';

const setlistSchema = new Schema<SetlistSchema>(
  {
    name: { type: String, required: true },
    date: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    songs: [{ type: Types.ObjectId, ref: 'Song' }],
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    publicLink: { type: String, required: false, unique: true, sparse: true, default: null },
    groupIds: [{ type: Types.ObjectId, ref: 'Group' }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Setlist = models.Setlist || model<SetlistSchema>('Setlist', setlistSchema);

export { Setlist };
