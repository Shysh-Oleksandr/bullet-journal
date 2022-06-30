import { Document } from 'mongoose';
import IUser from './user';

export default interface INote extends Document {
    title: string;
    author: IUser;
    startDate: number;
    endDate: number;
    content?: string;
    color: string;
    image?: string;
    type: string; // NoteTypes
    category?: string;
    rating: number;
    // milestones: IMilestone[];
}

export enum NoteTypes {
    NOTE = 'Note',
    EVENT = 'Event',
    GOAL = 'Goal',
    DIARY = 'Diary'
}
