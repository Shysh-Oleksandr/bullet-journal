"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("../config/logging"));
const habit_1 = __importDefault(require("../models/habit"));
const sortByCreatedDate_1 = require("../utils/sortByCreatedDate");
const create = (req, res, next) => {
    logging_1.default.info('Attempting to register habit...');
    let { label, color, description, author, amountTarget, units, streakTarget, overallTarget, startDate, frequency, habitType, logs } = req.body;
    const habit = new habit_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        label,
        color,
        description,
        author,
        amountTarget,
        units,
        streakTarget,
        overallTarget,
        startDate,
        frequency,
        habitType,
        logs
    });
    return habit
        .save()
        .then((newHabit) => {
        logging_1.default.info(`New habit created...`);
        return res.status(201).json({ habit: newHabit });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info(`Incoming read all habits...`);
    return habit_1.default.find({ author: author_id })
        .then((habits) => {
        const sortedHabits = (0, sortByCreatedDate_1.sortByCreatedDate)(habits);
        return res.status(200).json({
            count: habits.length,
            habits: sortedHabits
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.habitID;
    logging_1.default.info(`Incoming update for habit ${_id} ...`);
    return habit_1.default.findById(_id)
        .exec()
        .then((habit) => {
        if (habit) {
            habit.set(req.body);
            habit
                .save()
                .then((newHabit) => {
                logging_1.default.info(`Habit updated...`);
                return res.status(201).json({ habit: newHabit });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'habit not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const deleteHabit = (req, res, next) => {
    const _id = req.params.habitID;
    logging_1.default.info(`Incoming delete for habit ${_id} ...`);
    return habit_1.default.findByIdAndDelete(_id)
        .then(() => {
        return res.status(200).json({ message: `Habit ${_id} was deleted.` });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
exports.default = {
    create,
    readAll,
    update,
    deleteHabit
};
