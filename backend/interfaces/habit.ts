import IUser from './user';

export default interface IHabit extends Document {
    label: string;
    author: IUser;
    description?: string;
    amountTarget?: number;
    units?: string;
    streakTarget: number;
    overallTarget: number;
    startDate: number;
    isArchived?: boolean;
    order?: number;
    frequency: {
      days: number;
      period: IHabitPeriods;
    };
    color?: string;
    habitType: IHabitTypes;
    logs: IHabitLog[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type IHabitLog = {
    date: number;
    percentageCompleted: number;
    amount?: number;
    amountTarget?: number;
};

export enum IHabitTypes {
    CHECK = 'CHECK',
    AMOUNT = 'AMOUNT',
    TIME = 'TIME'
}

export enum IHabitPeriods {
  WEEK = "week",
  MONTH = "month",
}