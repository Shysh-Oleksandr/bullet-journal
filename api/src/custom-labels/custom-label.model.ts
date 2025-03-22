import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type LabelFor = 'Type' | 'Category' | 'Task';

@Schema({ timestamps: true })
export class CustomLabel extends Document {
  @Prop({ required: true })
  labelName: string;

  @Prop({ required: true })
  color: string;

  @Prop({ default: false })
  isCategoryLabel: boolean;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, enum: ['Type', 'Category', 'Task'] })
  labelFor: LabelFor;

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'labelFor' })
  refId: Types.ObjectId;
}

export const CustomLabelSchema = SchemaFactory.createForClass(CustomLabel);

// Export default labels for initialization
export const DEFAULT_LABELS = [
  {
    labelName: 'Note',
    color: '#0891b2',
    isDefault: true,
    labelFor: 'Type' as LabelFor,
  },
  {
    labelName: 'Event',
    color: '#FEC0CE',
    isDefault: true,
    labelFor: 'Type' as LabelFor,
  },
  {
    labelName: 'Diary',
    color: '#4A2545',
    isDefault: true,
    labelFor: 'Type' as LabelFor,
  },
  {
    labelName: 'Study',
    color: '#1B998B',
    isDefault: true,
    labelFor: 'Category' as LabelFor,
  },
  {
    labelName: 'Travel',
    color: '#4F518C',
    isDefault: true,
    labelFor: 'Category' as LabelFor,
  },
  {
    labelName: 'Work',
    color: '#FCDE9C',
    isDefault: true,
    labelFor: 'Category' as LabelFor,
  },
  {
    labelName: 'To Do',
    color: '#0891b2',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
  {
    labelName: 'In Progress',
    color: '#e3a605',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
  {
    labelName: 'On Hold',
    color: '#4A2545',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
  {
    labelName: 'Completed',
    color: '#12995c',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
  {
    labelName: 'High Priority',
    color: '#c21111',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
  {
    labelName: 'Medium Priority',
    color: '#c9939f',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
  {
    labelName: 'Low Priority',
    color: '#4eabd4',
    isDefault: true,
    labelFor: 'Task' as LabelFor,
  },
];
