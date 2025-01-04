import mongoose from 'mongoose';

export interface IGroup extends Document {
    name: string;
    color: string;
    author: mongoose.Types.ObjectId;
    parentGroupId?: mongoose.Types.ObjectId | null;
}

export interface IProject extends Document {
    name: string;
    author: mongoose.Types.ObjectId;
    groupId?: mongoose.Types.ObjectId;
    color: string;
    dueDate?: number;
    target?: number;
    units?: string;
    completedAmount?: number;
}

export interface ITask extends Document {
    name: string;
    author: mongoose.Types.ObjectId;
    dueDate?: number;
    color: string;
    projectId?: mongoose.Types.ObjectId;
    isCompleted: boolean;
    percentageCompleted?: number;
    parentTaskId?: mongoose.Types.ObjectId | null;
}
