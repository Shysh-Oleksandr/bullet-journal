import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './userApi';
import { RootState } from '../../store/store';
import {  User } from './types';
import logging from '../../config/logging';

export const STATE_KEY = 'user';

interface UserState {
    user: User | null;
    isAuthenticating: boolean;
    errorMsg: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticating: false,
    errorMsg: null
};

const userSlice = createSlice({
    name: STATE_KEY,
    initialState,
    reducers: {
        logout: () => {
            localStorage.removeItem('fire_token');
            localStorage.removeItem('uid');

            return initialState;
        }
    },
    extraReducers: (build) => {
        build.addMatcher(authApi.endpoints.login.matchPending, (state, action) => {
            state.isAuthenticating = true;
            state.errorMsg = null;
        });
        build.addMatcher(authApi.endpoints.validateToken.matchPending, (state, action) => {
            state.isAuthenticating = true;
            state.errorMsg = null;
        });
        build.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
            const { user } = action.payload;
            const { fire_token } = action.meta.arg.originalArgs;

            logging.info('Successfully authenticated.');

            localStorage.setItem('fire_token', fire_token);
            localStorage.setItem('uid', user.uid);

            state.isAuthenticating = false;
            state.errorMsg = null;
            state.user = user;
        });
        build.addMatcher(authApi.endpoints.validateToken.matchFulfilled, (state, action) => {
            const { user, fire_token } = action.payload;

            logging.info('Successfully validated token.');

            localStorage.setItem('fire_token', fire_token);
            localStorage.setItem('uid', user.uid);

            state.isAuthenticating = false;
            state.errorMsg = null;
            state.user = user;
        });
        build.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
            state.isAuthenticating = false;
            state.errorMsg = 'Unable to authenticate';
            localStorage.removeItem('fire_token');
            localStorage.removeItem('uid');
        });
        build.addMatcher(authApi.endpoints.validateToken.matchRejected, (state, action) => {
            state.isAuthenticating = false;
            state.errorMsg = 'Unable to validate token';
            localStorage.removeItem('fire_token');
            localStorage.removeItem('uid');
        });
    }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const getUserData = (state: RootState): User | null => state[STATE_KEY].user;

export const getUserId = (state: RootState): string | null => state[STATE_KEY].user?._id ?? null;

export const getIsAuthenticated = (state: RootState): boolean => !!state[STATE_KEY].user;

export const getIsAuthenticating = (state: RootState): boolean => state[STATE_KEY].isAuthenticating;

export const getAuthErrorMsg = (state: RootState): string | null => state[STATE_KEY].errorMsg;
