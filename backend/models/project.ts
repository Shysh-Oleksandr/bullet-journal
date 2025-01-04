import mongoose, { Schema } from 'mongoose';
import { IProject } from '../interfaces/task';

const ProjectSchema = new Schema<IProject>({
    name: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    color: { type: String },
    dueDate: { type: Number },
    target: { type: Number },
    units: { type: String },
    completedAmount: { type: Number },
});

export default mongoose.model<IProject>('Project', ProjectSchema);
