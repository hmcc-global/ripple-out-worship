import { Schema, model, models } from 'mongoose';
import { SongSchema } from '../types/song.types';

const songSchema = new Schema<SongSchema>(
  {
    title: { type: String, required: true },
    tempo: [{ type: String, required: false }],
    originalKey: { type: String, required: true },
    recommendedKeys: [{ type: String, required: false }],
    themes: [{ type: String, required: true }],
    artist: { type: String, required: true },
    year: { type: String, required: false },
    code: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    timeSignature: [{ type: String, required: false }],
    isVerified: { type: Boolean, default: false },
    chordLyrics: { type: String, required: true },
    simplifiedChordLyrics: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Song = models.Song || model<SongSchema>('Song', songSchema);

export { Song };
