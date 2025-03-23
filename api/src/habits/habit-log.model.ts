import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class HabitLog extends Document {
  @Prop({ required: true })
  date: number;

  @Prop({ required: true })
  percentageCompleted: number;

  @Prop({ required: false, default: null })
  amount?: number;

  @Prop({ required: false, default: null })
  amountTarget?: number;

  @Prop({ required: false, default: '' })
  note?: string;

  @Prop({ default: false })
  isManuallyOptional: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Habit', required: true })
  habitId: Types.ObjectId;
}

export const HabitLogSchema = SchemaFactory.createForClass(HabitLog);
