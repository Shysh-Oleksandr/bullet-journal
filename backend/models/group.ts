import mongoose, { Schema } from 'mongoose';
import { IGroup } from '../interfaces/task';

const GroupSchema = new Schema<IGroup>({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  parentGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
});

export default mongoose.model<IGroup>('Group', GroupSchema);


