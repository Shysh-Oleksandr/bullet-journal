import mongoose, { Schema } from 'mongoose';
import IImage from '../interfaces/image';

const ImageSchema: Schema = new Schema(
    {
      url: { type: String },
      noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

export default mongoose.model<IImage>('Image', ImageSchema);
