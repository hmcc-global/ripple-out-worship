import { Schema, model, models } from 'mongoose';
import { OwnershipSchema } from '../types/ownership.types';

const ownershipGroupSchema = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: String, required: true },
};
const ownershipSetlistSchema = ownershipGroupSchema;
const ownershipSchema = new Schema<OwnershipSchema>(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    accessType: { type: String, required: true, default: 'unsigned' },
    groupIds: [ownershipGroupSchema],
    setlistIds: [ownershipSetlistSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Ownership = models.Ownership || model<OwnershipSchema>('Ownership', ownershipSchema);

export { Ownership };
