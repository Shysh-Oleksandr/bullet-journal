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
const habit_1 = require("../interfaces/habit");
const HabitSchema = new mongoose_1.Schema({
    label: { type: String },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    streakTarget: { type: Number },
    overallTarget: { type: Number },
    amountTarget: { type: Number },
    units: { type: String },
    color: { type: String },
    isArchived: { type: Boolean, default: false },
    order: { type: Number },
    frequency: {
        days: { type: Number, default: 7 },
        period: {
            type: String,
            enum: habit_1.IHabitPeriods,
            default: habit_1.IHabitPeriods.WEEK,
        }
    },
    habitType: {
        type: String,
        enum: habit_1.IHabitTypes,
        default: habit_1.IHabitTypes.CHECK,
    },
    logs: [
        {
            date: { type: Number },
            percentageCompleted: { type: Number },
            amount: { type: Number },
            amountTarget: { type: Number },
            note: { type: String },
            isManuallyOptional: { type: Boolean, default: false }
        }
    ],
    id: { type: String, unique: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Habit', HabitSchema);
