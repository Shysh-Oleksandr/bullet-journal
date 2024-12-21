import mongoose, { Schema } from 'mongoose';
import IHabit, { IHabitPeriods, IHabitTypes } from '../interfaces/habit';

const HabitSchema: Schema = new Schema(
    {
        label: { type: String },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: { type: String },
        streakTarget: { type: Number },
        overallTarget: { type: Number },
        amountTarget: { type: Number },
        units: { type: String },
        color: { type: String },
        isArchived: { type: Boolean, default: false },
        order: { type: Number },
        frequency: {
          days: { type: Number, default: 7 },
          period: {
            type: String,
            enum: IHabitPeriods,
            default: IHabitPeriods.WEEK,
          }
        }, 
        habitType: {
          type: String,
          enum: IHabitTypes,
          default: IHabitTypes.CHECK,
        },
        logs: [
            {
                date: { type: Number },
                percentageCompleted: { type: Number },
                amount: { type: Number },
                amountTarget: { type: Number }
            }
        ],
        id: { type: String, unique: true }
    },
    { timestamps: true }
);

export default mongoose.model<IHabit>('Habit', HabitSchema);
