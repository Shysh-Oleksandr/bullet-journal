import { Document } from 'mongoose';
import { INoteType } from './note';

export default interface IUser extends Document {
    uid: string;
    name: string;
    customNoteTypes?: string;
    customNoteCategories?: string;
    isSidebarShown?: string;
}
