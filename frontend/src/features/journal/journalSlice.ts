import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import INote from '../../interfaces/note';

export interface IJournalState {
    notes: INote[];
}

const initialState: IJournalState = {
    notes: []
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
