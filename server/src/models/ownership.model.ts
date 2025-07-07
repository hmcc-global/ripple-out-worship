import { Schema, model, models, Types } from 'mongoose';
import { OwnershipSchema } from '../types/ownership.types';

const ownershipSchema = new Schema<OwnershipSchema>(
  {
    userId: { type: String, required: true, unique: true },
    groupIds: [{ type: Types.ObjectId, ref: 'Group' }],
    setlistIds: [{ type: Types.ObjectId, ref: 'Setlist' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Ownership = models.Ownership || model<OwnershipSchema>('Ownership', ownershipSchema);

export { Ownership };
