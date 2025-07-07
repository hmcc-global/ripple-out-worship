import { Schema, model, models, Types } from 'mongoose';
import { GroupSchema } from '../types/group.types';

const groupSchema = new Schema<GroupSchema>(
  {
    groupName: { type: String, required: true },
    ownerships: [{ type: Types.ObjectId, ref: 'Ownership' }],
    setlistIds: [{ type: Types.ObjectId, ref: 'Setlist' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'Ownership' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Group = models.Group || model<GroupSchema>('Group', groupSchema);

export { Group };
