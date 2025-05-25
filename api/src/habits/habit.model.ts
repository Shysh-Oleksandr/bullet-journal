import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HabitLogSchema } from './habit-log.model';
import { HabitLog } from './habit-log.model';

export enum HabitPeriod {
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
  @Prop({ type: Number, default: 7 })
  days: number;

  @Prop({ type: String, enum: HabitPeriod, default: HabitPeriod.WEEK })
  period: HabitPeriod;
}

export const HabitFrequencySchema =
  SchemaFactory.createForClass(HabitFrequency);

@Schema()
export class HabitStreak {
  @Prop({ type: Date })
  startDate: Date;
  @Prop({ type: Date })
  endDate: Date;
  @Prop({ type: Number, default: 0 })
  numberOfLogs: number;
}

export const HabitStreakSchema = SchemaFactory.createForClass(HabitStreak);

@Schema()
export class HabitCalendarData {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: false })
  isOptional: boolean;

  @Prop({ type: Object, required: true })
  streakState: {
    displayRightLine: boolean;
    displayLeftLine: boolean;
  };

  @Prop({ required: true })
  percentageCompleted: number;

  @Prop({ required: false })
  amount?: number;

  @Prop({ required: false })
  note?: string;

  @Prop({ required: false, default: false })
  isManuallyOptional: boolean;
}

export const HabitCalendarDataSchema =
  SchemaFactory.createForClass(HabitCalendarData);

@Schema()
export class CachedMetrics {
  @Prop({ type: Number, default: 0 })
  currentStreak: number;

  @Prop({ type: Number, default: 0 })
  longestStreak: number;

  @Prop({ type: Number, default: 0 })
  overallCompletions: number;

  @Prop({ type: Number, default: null })
  oldestLogDate: number;

  @Prop({ type: Number, default: null })
  firstCompletedLogDate: number;

  @Prop({ type: [HabitStreakSchema], default: [] })
  bestStreaks?: HabitStreak[];

  @Prop({ type: Object, default: {} })
  calendarData?: Record<string, HabitCalendarData>;

  @Prop({ type: Number, default: null })
  lastCalendarDataUpdate?: number;
}

export const CachedMetricsSchema = SchemaFactory.createForClass(CachedMetrics);

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

  @Prop({ type: [HabitLogSchema], default: [] })
  featuredLogs: HabitLog[];

  @Prop({ type: CachedMetricsSchema, default: () => ({}) })
  cachedMetrics: CachedMetrics;

  @Prop({
    type: String,
    enum: HabitType,
    default: HabitType.CHECK,
  })
  habitType: HabitType;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
