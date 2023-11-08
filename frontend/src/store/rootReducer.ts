import { combineReducers } from '@reduxjs/toolkit';

import UserReducer, { STATE_KEY as USER_STATE_KEY } from '../features/user/userSlice';
import JournalReducer, { STATE_KEY as JOURNAL_STATE_KEY } from '../features/journal/journalSlice';

import { emptyAxiosApi } from './api/emptyAxiosApi';

const rootReducer = combineReducers({
    // App Reducers
    [USER_STATE_KEY]: UserReducer,
    [JOURNAL_STATE_KEY]: JournalReducer,
    // RTK query reducers
    [emptyAxiosApi.reducerPath]: emptyAxiosApi.reducer
});

export default rootReducer;
