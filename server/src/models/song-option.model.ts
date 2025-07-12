import { Schema, model, models } from 'mongoose';
import { SongOptionSchema } from '../types/song-option.types';

const songOptionSchema = new Schema<SongOptionSchema>(
  {
    category: { type: String, required: true },
    list: [{ type: String, required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SongOption = models.SongOption || model<SongOptionSchema>('SongOption', songOptionSchema);

export { SongOption };
