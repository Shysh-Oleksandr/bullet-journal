import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import INote, { NoteTypes } from './../../interfaces/note';

export interface IJournalState {
    notes: INote[];
}

const initialState: IJournalState = {
    notes: [
        {
            title: 'Wood work',
            startDate: new Date('June 21, 2022').getTime(),
            endDate: new Date('June 21, 2022').getTime(),
            image: 'https://media.istockphoto.com/photos/bed-construction-picture-id1225367171?k=20&m=1225367171&s=612x612&w=0&h=yAa57KszobVOqspjRQcyGoxiWvTXgfNCnul5S8UnYbc=',
            description: "Half a day I polish the wooden bed of my parents with my mom. I still didn't get it - why should I have done it?",
            color: '#ef6ecd',
            type: NoteTypes.EVENT,
            // author: 'me',
            createdAt: new Date('June 21, 2022').getTime().toString(),
            updatedAt: new Date('June 21, 2022').getTime().toString(),
            rating: 8,
            _id: uuidv4()
        },
        {
            title: 'Ran 10 km',
            startDate: new Date('May 14, 2022').getTime(),
            endDate: new Date('May 14, 2022').getTime(),
            description: 'Was going to run 8 km, but since I got strengh, ran 10 instead. Felt very bad after the running. But accomplished my goal',
            color: '#ccaacb',
            category: 'Sport',
            type: NoteTypes.EVENT,
            // author: 'me',
            createdAt: new Date('June 21, 2022').getTime().toString(),
            updatedAt: new Date('June 21, 2022').getTime().toString(),
            rating: 8,
            _id: uuidv4()
        },
        {
            title: 'Wood work',
            startDate: new Date('June 21, 2022').getTime(),
            endDate: new Date('June 21, 2022').getTime(),
            description: "Half a day I polish the wooden bed of my parents with my mom. I still didn't get it - why should I have done it?",
            color: '#ef6ecd',
            type: NoteTypes.EVENT,
            // author: 'me',
            createdAt: new Date('June 21, 2022').getTime().toString(),
            updatedAt: new Date('June 21, 2022').getTime().toString(),
            rating: 8,
            _id: uuidv4()
        },
        {
            title: 'Ran 10 km',
            startDate: new Date('May 14, 2022').getTime(),
            endDate: new Date('May 14, 2022').getTime(),
            description: 'Was going to run 8 km, but since I got strengh, ran 10 instead. Felt very bad after the running. But accomplished my goal',
            color: '#ccaacb',
            category: 'Sport',
            // author: 'me',
            createdAt: new Date('June 21, 2022').getTime().toString(),
            updatedAt: new Date('June 21, 2022').getTime().toString(),
            rating: 8,
            type: NoteTypes.EVENT,
            _id: uuidv4()
        }
    ]
};

export const journalSlice = createSlice({
    name: 'journal',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setNotes: (state, { payload }: PayloadAction<INote[]>) => {
            state.notes = payload;
        }
    }
});

export const { setNotes } = journalSlice.actions;

export default journalSlice.reducer;
