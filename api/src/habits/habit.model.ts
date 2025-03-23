import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum HabitPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum HabitType {
  CHECK = 'CHECK',
  AMOUNT = 'AMOUNT',
  TIME = 'TIME',
}

@Schema()
export class HabitFrequency {
  @Prop({ type: [Number], default: [0, 1, 2, 3, 4, 5, 6] })
  days: number[];

  @Prop({ type: String, enum: HabitPeriod, default: HabitPeriod.DAY })
  period: HabitPeriod;
}

export const HabitFrequencySchema =
  SchemaFactory.createForClass(HabitFrequency);

@Schema({ timestamps: true })
export class Habit extends Document {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 0 })
  streakTarget: number;

  @Prop({ default: 0 })
  overallTarget: number;

  @Prop({ default: 0 })
  amountTarget: number;

  @Prop({ default: '' })
  units: string;

  @Prop({ default: '#4a9d9c' })
  color: string;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ type: HabitFrequencySchema, default: () => ({}) })
  frequency: HabitFrequency;

  @Prop({
    type: String,
    enum: HabitType,
    default: HabitType.CHECK,
  })
  habitType: HabitType;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
