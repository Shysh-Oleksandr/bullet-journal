import IUser from './user';

export default interface INote {
    title: string;
    author: string | IUser;
    startDate: number;
    endDate: number;
    content?: string;
    color: string;
    image?: string;
    type: string | NoteTypes;
    category?: string;
    rating: number;
    _id: string;
    // createdAt: string;
    // updatedAt: string;
    // milestones: IMilestone[];
}

export enum NoteTypes {
    NOTE = 'Note',
    EVENT = 'Event',
    GOAL = 'Goal',
    DIARY = 'Diary'
}
