import { Document } from 'mongoose';
import IUser from './user';
import INote from './note';

export default interface IImage extends Document {
  url: string;
  author: IUser;
  noteId?: INote;
  createdAt?: Date;
  updatedAt?: Date;
}
