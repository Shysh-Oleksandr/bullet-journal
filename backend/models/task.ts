import mongoose, { Schema } from 'mongoose';
import { ITask, ITaskTypes } from '../interfaces/task';

const TaskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Number },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    color: { type: String },
    isCompleted: { type: Boolean, default: false },
    type: {
        type: String,
        enum: ITaskTypes,
        default: ITaskTypes.CHECK
    },
    target: { type: Number },
    units: { type: String },
    completedAmount: { type: Number },
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    isArchived: { type: Boolean, default: false },
    completedAt: { type: Number },
    customLabels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomLabel' }] 
});

export default mongoose.model<ITask>('Task', TaskSchema);
