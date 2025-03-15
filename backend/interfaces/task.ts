import mongoose from 'mongoose';
import ICustomLabel from './customLabel';

export interface IGroup extends Document {
    name: string;
    description?: string;
    color: string;
    author: mongoose.Types.ObjectId;
    parentGroupId?: mongoose.Types.ObjectId | null;
    isArchived?: boolean;
}

export interface ITask extends Document {
    name: string;
    description?: string;
    author: mongoose.Types.ObjectId;
    dueDate?: number;
    color: string;
    groupId?: mongoose.Types.ObjectId;
    isCompleted: boolean;
    parentTaskId?: mongoose.Types.ObjectId | null;
    type: ITaskTypes;
    target?: number;
    units?: string;
    completedAmount?: number;
    isArchived?: boolean;
    completedAt?: number | null;
    customLabels: ICustomLabel[];
}

export enum ITaskTypes {
  CHECK = "check",
  AMOUNT = "amount",
}
