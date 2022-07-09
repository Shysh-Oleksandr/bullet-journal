import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import IUser, { DEFAULT_USER } from '../../interfaces/user';
import { DEFAULT_FIRE_TOKEN } from '../../interfaces/user';
import config from './../../config/config';

export interface IUserState {
    user: IUser;
    fire_token: string;
}

export const initialState: IUserState = {
    user: DEFAULT_USER,
    fire_token: DEFAULT_FIRE_TOKEN
};

interface IUserData {
    oldUser: IUser;
    newUserData: any;
}

export const updateUserData = createAsyncThunk('user/updateUserStatus', async ({ oldUser, newUserData }: IUserData) => {
    const response = await axios({
        method: 'PATCH',
        url: `${config.server.url}/users/update/${oldUser._id}`,
        data: newUserData
    });

    if (response.status === 201) {
        const updatedUser = response.data.user as IUser;

        return updatedUser;
    } else {
        return oldUser;
    }
});

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
        logout: () => {
            localStorage.removeItem('fire_token');

            return initialState;
        },
        updateUser: (state, { payload }: PayloadAction<IUser>) => {
            state.user = payload;
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(updateUserData.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    }
});

export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
