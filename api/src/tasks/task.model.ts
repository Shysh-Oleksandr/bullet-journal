import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum TaskType {
  CHECK = 'check',
  AMOUNT = 'amount',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  dueDate: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop()
  color: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: String, enum: TaskType, default: TaskType.CHECK })
  type: TaskType;

  @Prop()
  target: number;

  @Prop()
  units: string;

  @Prop()
  completedAmount: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Task', default: null })
  parentTaskId: Types.ObjectId | null;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop()
  completedAt: number;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'CustomLabel' }] })
  customLabels: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
