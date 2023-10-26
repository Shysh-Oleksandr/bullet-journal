import mongoose, { Schema } from 'mongoose';
import IUser from './../interfaces/user';
import { INoteType } from './../interfaces/note';

const UserSchema: Schema = new Schema(
    {
        uid: { type: String, unique: true },
        name: { type: String }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);
