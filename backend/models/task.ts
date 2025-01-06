import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/task';

const TaskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    dueDate: { type: Number },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    color: { type: String },
    isCompleted: { type: Boolean, default: false },
    target: { type: Number },
    units: { type: String },
    completedAmount: { type: Number },
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
});

export default mongoose.model<ITask>('Task', TaskSchema);
