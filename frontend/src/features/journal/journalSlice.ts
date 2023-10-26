import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import INote from '../../interfaces/note';
import config from './../../config/config';
import { dateDiffInDays } from './../../utils/functions';
import { logout } from '../user/userSlice';
import { RootState } from '../../store/store';
import { User } from '../user/types';

export const STATE_KEY = 'journal';

interface JournalState {
    notes: INote[];
    loading: boolean;
    isSidebarShown?: boolean;
    isFilterBarShown?: boolean;
    error: string;
    success: string;
    oldestNoteDate: number;
}

const initialState: JournalState = {
    notes: [],
    loading: true,
    isSidebarShown: (document.documentElement.clientWidth > 1023 && localStorage.getItem('isSidebarShown') === 'true') || false,
    isFilterBarShown: (document.documentElement.clientWidth > 425 && localStorage.getItem('isFilterBarShown') === 'true') || false,
    error: '',
    success: '',
    oldestNoteDate: 0
};

export interface IFilterNotes {
    user: User;
    filter?: (notes: INote[]) => INote[];
    sort?: (notes: INote[]) => INote[];
}

export const fetchAllNotes = createAsyncThunk('journal/fetchAllNotesStatus', async ({ user, filter, sort }: IFilterNotes) => {
    const response = await axios({
        method: 'GET',
        url: `${config.server.url}/notes/${user._id}`
    });

    if (response.status === 200 || response.status === 304) {
        let notes = response.data.notes as INote[];
        const oldestNoteDate = notes.sort((x, y) => y.startDate - x.startDate).at(-1)?.startDate;
        notes = filter ? filter(notes) : notes;
        const endNotes: INote[] = notes
            .filter((note) => dateDiffInDays(new Date(note.startDate), new Date(note.endDate)) + 1 >= 2)
            .map((note) => {
                // Adding end date notes.
                const copyNote = JSON.parse(JSON.stringify(note));
                copyNote.isEndNote = true;
                const startDate = copyNote.startDate;
                copyNote.startDate = copyNote.endDate;
                copyNote.endDate = startDate;
                return copyNote;
            });
        notes = [...notes, ...endNotes].filter((note) => note.startDate <= new Date().getTime());

        notes = sort ? sort(notes) : notes.sort((x, y) => y.startDate - x.startDate);
        return { notes: notes, oldestNoteDate: oldestNoteDate };
    } else {
        return { notes: [] };
    }
});

export const journalSlice = createSlice({
    name: STATE_KEY,
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setNotes: (state, { payload }: PayloadAction<INote[]>) => {
            state.notes = payload;
        },
        setError: (state, { payload }: PayloadAction<string>) => {
            state.error = payload;
        },
        setShowSidebar: (state, { payload }: PayloadAction<boolean>) => {
            state.isSidebarShown = payload;
            localStorage.setItem('isSidebarShown', payload.toString());
        },
        setShowFilterBar: (state, { payload }: PayloadAction<boolean>) => {
            state.isFilterBarShown = payload;
            localStorage.setItem('isFilterBarShown', payload.toString());
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
            state.notes = action.payload.notes;
            state.loading = false;
            if (!state.oldestNoteDate) state.oldestNoteDate = action.payload.oldestNoteDate ? action.payload.oldestNoteDate : state.oldestNoteDate;
        });
        builder.addCase(fetchAllNotes.rejected, (state, action) => {
            state.loading = false;
            state.error = 'Unable to retreive notes.';
        });
        builder.addMatcher(logout.match, () => ({
            ...initialState
        }));
    }
});

export const { setNotes, setError, setSuccess, setShowFilterBar, setShowSidebar } = journalSlice.actions;

export default journalSlice.reducer;

// Selectors
export const getNotes = (state: RootState): INote[] => state[STATE_KEY].notes;
