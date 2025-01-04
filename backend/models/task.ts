import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/task';

const TaskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    dueDate: { type: Number },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    color: { type: String },
    isCompleted: { type: Boolean, default: false },
    percentageCompleted: { type: Number },
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
});

export default mongoose.model<ITask>('Task', TaskSchema);
