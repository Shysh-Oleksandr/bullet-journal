"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("../config/logging"));
const habit_1 = __importDefault(require("../models/habit"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to register habit...');
    let { label, color, description, author, amountTarget, units, streakTarget, overallTarget, frequency, habitType, logs } = req.body;
    const order = yield habit_1.default.countDocuments({ author }).exec();
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
        frequency,
        habitType,
        logs,
        order
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
});
const reorder = (req, res, next) => {
    logging_1.default.info(`Incoming reorder habits...`);
    const habitsIds = req.body;
    if (!habitsIds || !Array.isArray(habitsIds)) {
        return res.status(400).send({ message: 'Invalid request body.' });
    }
    const bulkOps = habitsIds.map((habitId, index) => ({
        updateOne: {
            filter: { _id: new mongoose_1.default.Types.ObjectId(habitId) },
            update: { $set: { order: index } } // Use $set to update the "order" field
        }
    }));
    return habit_1.default.collection
        .bulkWrite(bulkOps)
        .then((result) => {
        logging_1.default.info(`BulkWrite result: ${JSON.stringify(result)}`);
        return res.status(200).send({ message: 'Habits reordered successfully.' });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info(`Incoming read all habits...`);
    return habit_1.default.find({ author: author_id }).sort({ order: 1 })
        .then((habits) => {
        return res.status(200).json({
            count: habits.length,
            habits: habits
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const read = (req, res, next) => {
    const _id = req.params.habitID;
    logging_1.default.info(`Incoming read for habit ${_id} ...`);
    return habit_1.default.findById(_id)
        .then((habit) => {
        return res.status(200).json({ habit });
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
    reorder,
    read,
    readAll,
    update,
    deleteHabit
};
