import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { User } from '../user/types';
import { logout } from '../user/userSlice';
import { notesApi } from './journalApi';
import { CustomLabel, Note } from './types';

export const STATE_KEY = 'journal';

interface JournalState {
    notes: Note[];
    errorMsg: string | null;
    successMsg: string | null;
    types: CustomLabel[];
    categories: CustomLabel[];
    isSidebarShown: boolean;
    isFilterBarShown: boolean;
    oldestNoteDate: number | null;
}

const initialState: JournalState = {
    notes: [],
    types: [],
    categories: [],
    errorMsg: null,
    successMsg: null,
    isSidebarShown: document.documentElement.clientWidth > 1023 && localStorage.getItem('isSidebarShown') === 'true',
    isFilterBarShown: document.documentElement.clientWidth > 425 && localStorage.getItem('isFilterBarShown') === 'true',
    oldestNoteDate: null
};

export interface IFilterNotes {
    user: User;
    filter?: (notes: Note[]) => Note[];
    sort?: (notes: Note[]) => Note[];
}

// export const fetchAllNotes = createAsyncThunk('journal/fetchAllNotesStatus', async ({ user, filter, sort }: IFilterNotes) => {
//     const response = await axios({
//         method: 'GET',
//         url: `${config.server.url}/notes/${user._id}`
//     });

//     if (response.status === 200 || response.status === 304) {
//         let notes = response.data.notes as Note[];
//         const oldestNoteDate = notes.sort((x, y) => y.startDate - x.startDate).at(-1)?.startDate;
//         notes = filter ? filter(notes) : notes;
//         const endNotes: Note[] = notes
//             .filter((note) => note.endDate && dateDiffInDays(new Date(note.startDate), new Date(note.endDate)) + 1 >= 2)
//             .map((note) => {
//                 // Adding end date notes.
//                 const copyNote = JSON.parse(JSON.stringify(note));
//                 copyNote.isEndNote = true;
//                 const startDate = copyNote.startDate;
//                 copyNote.startDate = copyNote.endDate;
//                 copyNote.endDate = startDate;
//                 return copyNote;
//             });
//         notes = [...notes, ...endNotes].filter((note) => note.startDate <= new Date().getTime());

//         notes = sort ? sort(notes) : notes.sort((x, y) => y.startDate - x.startDate);
//         return { notes: notes, oldestNoteDate: oldestNoteDate };
//     } else {
//         return { notes: [] };
//     }
// });

export const journalSlice = createSlice({
    name: STATE_KEY,
    initialState,
    reducers: {
        setErrorMsg: (state, { payload }: PayloadAction<string | null>) => {
            state.errorMsg = payload;
        },
        setSuccessMsg: (state, { payload }: PayloadAction<string | null>) => {
            state.successMsg = payload;
        },
        setShowSidebar: (state, { payload }: PayloadAction<boolean>) => {
            state.isSidebarShown = payload;
            localStorage.setItem('isSidebarShown', payload.toString());
        },
        setShowFilterBar: (state, { payload }: PayloadAction<boolean>) => {
            state.isFilterBarShown = payload;
            localStorage.setItem('isFilterBarShown', payload.toString());
        }
    },
    extraReducers: (builder) => {
        // Fetch all notes
        builder.addMatcher(notesApi.endpoints.fetchNotes.matchFulfilled, (state, action) => {
            const { notes } = action.payload;

            state.notes = notes;
            state.oldestNoteDate = notes.at(-1)?.startDate ?? 0;
        });
        builder.addMatcher(notesApi.endpoints.fetchLabels.matchFulfilled, (state, action) => {
            if (action.meta.arg.originalArgs.labelFor === 'Type') {
                state.types = action.payload.customLabels;
            }
            if (action.meta.arg.originalArgs.labelFor === 'Category') {
                state.categories = action.payload.customLabels;
            }
        });
        builder.addMatcher(logout.match, () => ({
            ...initialState
        }));
    }
});

export const { setErrorMsg, setSuccessMsg, setShowFilterBar, setShowSidebar } = journalSlice.actions;

export default journalSlice.reducer;

// Selectors
export const getNotes = (state: RootState): Note[] => state[STATE_KEY].notes;

export const getNoteById = createSelector([getNotes, (_, noteId: string) => noteId], (notes, noteId) => notes.find((note) => note._id === noteId));

export const getOldestNoteDate = (state: RootState): number | null => state[STATE_KEY].oldestNoteDate;

export const getIsSidebarShown = (state: RootState): boolean => state[STATE_KEY].isSidebarShown;
export const getIsFilterBarShown = (state: RootState): boolean => state[STATE_KEY].isFilterBarShown;

export const getErrorMsg = (state: RootState): string | null => state[STATE_KEY].errorMsg;
export const getSuccessMsg = (state: RootState): string | null => state[STATE_KEY].successMsg;
export const getInfoMessages = (state: RootState) => ({ successMsg: state[STATE_KEY].successMsg, errorMsg: state[STATE_KEY].errorMsg });

export const getCustomTypes = (state: RootState): CustomLabel[] => state[STATE_KEY].types;
export const getCustomCategories = (state: RootState): CustomLabel[] => state[STATE_KEY].categories;
