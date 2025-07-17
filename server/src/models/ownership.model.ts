import { Schema, model, models } from 'mongoose';
import { OwnershipSchema } from '../types/ownership.types';

const ownershipSchema = new Schema<OwnershipSchema>(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accessType: { type: String, required: true, default: 'unsigned' },
    groupIds: [{ type: Object, ref: 'Group' }],
    setlistIds: [{ type: Object, ref: 'Setlist' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Ownership = models.Ownership || model<OwnershipSchema>('Ownership', ownershipSchema);

export { Ownership };
