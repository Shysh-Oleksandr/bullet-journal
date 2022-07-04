import mongoose, { Schema } from 'mongoose';
import IUser from './../interfaces/user';
import { INoteType } from './../interfaces/note';

const UserSchema: Schema = new Schema(
    {
        uid: { type: String, unique: true },
        name: { type: String },
        customNoteTypes: { type: String },
        customNoteCategories: { type: String },
        isSidebarShown: { type: Boolean },
        isFilterBarShown: { type: Boolean }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);
