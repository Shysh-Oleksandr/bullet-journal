import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser, { DEFAULT_USER } from '../../interfaces/user';
import { DEFAULT_FIRE_TOKEN } from './../../interfaces/user';

export interface IUserState {
    user: IUser;
    fire_token: string;
}

export const initialState: IUserState = {
    user: DEFAULT_USER,
    fire_token: DEFAULT_FIRE_TOKEN
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        login: (state, { payload }: PayloadAction<IUserState>) => {
            let user = payload.user;
            let fire_token = payload.fire_token;

            localStorage.setItem('fire_token', fire_token);

            return { user, fire_token };
        },
        logout: (state) => {
            localStorage.removeItem('fire_token');

            return initialState;
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
