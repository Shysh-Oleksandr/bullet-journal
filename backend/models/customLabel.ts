import mongoose, { Schema } from 'mongoose';
import ICustomLabel from './../interfaces/customLabel';

const CustomLabelSchema: Schema = new Schema(
    {
        labelName: { type: String },
        color: { type: String },
        isCategoryLabel: { type: Boolean },
        isDefault: { type: Boolean },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

export default mongoose.model<ICustomLabel>('CustomLabel', CustomLabelSchema);
