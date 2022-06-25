export default interface INote {
    title: string;
    startDate: number;
    endDate: number;
    description?: string;
    color: string;
    image?: string;
    type: NoteTypes;
    category?: string;
    id: string;
    // milestones: IMilestone[];
}

export enum NoteTypes {
    NOTE = 'Note',
    EVENT = 'Event',
    GOAL = 'Goal',
    DIARY = 'Diary'
}
