import mongoose, { Schema } from 'mongoose';
import INote from '../interfaces/note';

const NoteSchema: Schema = new Schema({
    title: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Number },
    endDate: { type: Number },
    content: { type: String },
    color: { type: String },
    image: { type: String },
    type: { type: String },
    category: { type: String },
    rating: { type: Number },
    isLocked: { type: Boolean },
    isStarred: { type: Boolean },
    id: { type: String, unique: true }
});

export default mongoose.model<INote>('Note', NoteSchema);
