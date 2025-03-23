import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Image extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Note' })
  noteId: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
