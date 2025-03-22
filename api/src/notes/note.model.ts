import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ default: () => new Date().getTime() })
  startDate: number;

  @Prop()
  content: string;

  @Prop({ default: '#0891b2' })
  color: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'CustomLabel', default: null })
  type: Types.ObjectId | null;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'CustomLabel' }] })
  category: Types.ObjectId[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Image' }] })
  images: Types.ObjectId[];

  @Prop({ default: 1 })
  rating: number;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ default: false })
  isStarred: boolean;

  @Prop({ default: false })
  isDefault: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
