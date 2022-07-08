import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import INote from '../../interfaces/note';
import config from './../../config/config';
import IUser from './../../interfaces/user';
import { dateDiffInDays, getInitialNote } from './../../utils/functions';

export interface IJournalState {
    notes: INote[];
    loading: boolean;
    showFilteredNotes?: boolean;
    error: string;
    success: string;
}

const initialState: IJournalState = {
    notes: [],
    loading: true,
    showFilteredNotes: false,
    error: '',
    success: ''
};

export const fetchAllNotes = createAsyncThunk('journal/fetchAllNotesStatus', async (user: IUser) => {
    const response = await axios({
        method: 'GET',
        url: `${config.server.url}/notes/${user._id}`
    });

    if (response.status === 200 || response.status === 304) {
        let notes = response.data.notes as INote[];
        const endNotes: INote[] = notes
            .filter((note) => dateDiffInDays(new Date(note.startDate), new Date(note.endDate)) + 1 >= 2)
            .map((note) => {
                const copyNote = JSON.parse(JSON.stringify(note));
                copyNote.isEndNote = true;
                const startDate = copyNote.startDate;
                copyNote.startDate = copyNote.endDate;
                copyNote.endDate = startDate;
                return copyNote;
            });
        notes = [...notes, ...endNotes].filter((note) => note.startDate <= new Date().getTime());
        notes.push(getInitialNote(user));
        notes.sort((x, y) => y.startDate - x.startDate);
        return notes;
    } else {
        return [];
    }
});

export interface IFilterNotes {
    user: IUser;
    title: string;
    filter: (notes: INote[]) => INote[];
    sort: (notes: INote[]) => INote[];
}

export const filterNotes = createAsyncThunk('journal/filterNotesStatus', async ({ user, title, filter, sort }: IFilterNotes) => {
    const titleParams = `title=${title}`;

    const response = await axios({
        method: 'GET',
        url: `${config.server.url}/notes/query/${user._id}?${titleParams}`
    });

    if (response.status === 200 || response.status === 304) {
        let notes = response.data.notes as INote[];
        title === '' && notes.push(getInitialNote(user));
        notes = filter(notes);
        const endNotes: INote[] = notes
            .filter((note) => dateDiffInDays(new Date(note.startDate), new Date(note.endDate)) + 1 >= 2)
            .map((note) => {
                const copyNote = JSON.parse(JSON.stringify(note));
                copyNote.isEndNote = true;
                const startDate = copyNote.startDate;
                copyNote.startDate = copyNote.endDate;
                copyNote.endDate = startDate;
                return copyNote;
            });
        notes = [...notes, ...endNotes].filter((note) => note.startDate <= new Date().getTime());
        // notes.sort((x, y) => y.startDate - x.startDate);
        notes = sort(notes);
        return notes;
    } else {
        return [];
    }
});

export const journalSlice = createSlice({
    name: 'journal',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setNotes: (state, { payload }: PayloadAction<INote[]>) => {
            state.notes = payload;
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state.error = payload;
        },
        setSuccess: (state, { payload }: PayloadAction<string>) => {
            state.success = payload;
        }
    },
    extraReducers: (builder) => {
        // Fetch all notes
        builder.addCase(fetchAllNotes.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchAllNotes.fulfilled, (state, action) => {
            state.notes = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchAllNotes.rejected, (state, action) => {
            state.loading = false;
            state.error = 'Unable to retreive notes.';
        });
        // Filter notes
        builder.addCase(filterNotes.pending, (state, action) => {
            // state.loading = true;
        });
        builder.addCase(filterNotes.fulfilled, (state, action) => {
            state.notes = action.payload;
            // state.loading = false;
        });
        builder.addCase(filterNotes.rejected, (state, action) => {
            // state.loading = false;
            state.error = 'Unable to retreive notes.';
        });
    }
});

export const { setNotes, setError, setSuccess } = journalSlice.actions;

export default journalSlice.reducer;
