import mongoose, { Schema } from 'mongoose';
import { IGroup } from '../interfaces/task';

const GroupSchema = new Schema<IGroup>({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String, required: true },
  parentGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  isArchived: { type: Boolean, default: false }
});

export default mongoose.model<IGroup>('Group', GroupSchema);


