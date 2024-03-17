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
    frequency: {
        weekdays: number[];
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
