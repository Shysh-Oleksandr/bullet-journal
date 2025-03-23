import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Group', default: null })
  parentGroupId: Types.ObjectId | null;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'CustomLabel' }] })
  customLabels: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
