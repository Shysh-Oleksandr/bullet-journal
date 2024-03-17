import mongoose, { Schema } from 'mongoose';
import IHabit, { IHabitTypes } from '../interfaces/habit';

const HabitSchema: Schema = new Schema(
    {
        label: { type: String },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: { type: String },
        startDate: { type: Number },
        streakTarget: { type: Number },
        overallTarget: { type: Number },
        amountTarget: { type: Number },
        units: { type: String },
        color: { type: String },
        frequency: {
            weekdays: [{ type: Number }]
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
