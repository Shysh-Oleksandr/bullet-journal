export type Note = {
    _id: string;
    author: string;
    title: string;
    content: string;
    color: string;
    startDate: number;
    endDate?: number;
    rating: number;
    isLocked?: boolean;
    isStarred?: boolean;
    image?: string;
    isEndNote?: boolean;
    type: CustomLabel | null;
    category: CustomLabel[];
};

export interface CustomLabel {
    labelName: string;
    color: string;
    isCategoryLabel: boolean;
    user: string; // userId
    _id: string;
}

export type FetchNotesResponse = {
    count: number;
    notes: Note[];
};

export type FetchNoteByIdResponse = {
    note: Note;
};

export type CreateNoteResponse = FetchNoteByIdResponse;

export type FetchLabelsResponse = {
    count: number;
    customLabels: CustomLabel[];
};

export type UpdateNoteRequest = Omit<Note, 'type' | 'category'> & {
    type: string | null;
    category: string[];
};
export type UpdateLabelRequest = CustomLabel;

export type CreateLabelResponse = {
    customLabel: CustomLabel;
};

export type CreateNoteRequest = Omit<Note, '_id' | 'type' | 'category'> & {
    type: string | null;
    category: string[];
};
export type CreateLabelRequest = Omit<CustomLabel, '_id'>;
