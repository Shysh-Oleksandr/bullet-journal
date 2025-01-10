"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const task_1 = require("../interfaces/task");
const TaskSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    dueDate: { type: Number },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Group' },
    color: { type: String },
    isCompleted: { type: Boolean, default: false },
    type: {
        type: String,
        enum: task_1.ITaskTypes,
        default: task_1.ITaskTypes.CHECK
    },
    target: { type: Number },
    units: { type: String },
    completedAmount: { type: Number },
    parentTaskId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Task' },
    isArchived: { type: Boolean, default: false },
    completedAt: { type: Number }
});
exports.default = mongoose_1.default.model('Task', TaskSchema);
