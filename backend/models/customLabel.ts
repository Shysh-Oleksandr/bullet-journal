import mongoose, { Schema } from 'mongoose';
import ICustomLabel from './../interfaces/customLabel';

const CustomLabelSchema: Schema = new Schema(
    {
        labelName: { type: String },
        color: { type: String },
        isCategoryLabel: { type: Boolean },
        isDefault: { type: Boolean }, 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        labelFor: { type: String, enum: ['Type', 'Category', 'Task'], required: true},
        refId: { type: mongoose.Schema.Types.ObjectId, refPath: 'labelFor' }
    },
    { timestamps: true }
);

export default mongoose.model<ICustomLabel>('CustomLabel', CustomLabelSchema);
