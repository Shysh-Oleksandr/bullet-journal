import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser, { DEFAULT_FIRE_TOKEN, DEFAULT_USER } from '../../interfaces/user';

export const STATE_KEY = 'user';

interface UserState {
    user: IUser;
    fire_token: string;
}

const initialState: UserState = {
    user: DEFAULT_USER,
    fire_token: DEFAULT_FIRE_TOKEN
};

const userSlice = createSlice({
    name: STATE_KEY,
    initialState,
    reducers: {
        login: (_, { payload }: PayloadAction<UserState>) => {
            let user = payload.user;
            let fire_token = payload.fire_token;

            localStorage.setItem('fire_token', fire_token);
            localStorage.setItem('uid', user.uid);

            return { user, fire_token };
        },
        logout: () => {
            localStorage.removeItem('fire_token');
            localStorage.removeItem('uid');

            return initialState;
        },
        updateUser: (state, { payload }: PayloadAction<IUser>) => {
            state.user = payload;
        }
    }
});

export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
