import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Habit from '../models/habit';

const create = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register habit...');

    let { label, color, description, author, amountTarget, units, streakTarget, overallTarget, frequency, habitType, logs } = req.body;

    const order = await Habit.countDocuments({ author }).exec();

    const habit = new Habit({
        _id: new mongoose.Types.ObjectId(),
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
            logging.info(`New habit created...`);
            return res.status(201).json({ habit: newHabit });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const reorder = (req: Request, res: Response, next: NextFunction) => {
    logging.info(`Incoming reorder habits...`);

    const habitsIds: string[] = req.body;

    if (!habitsIds || !Array.isArray(habitsIds)) {
        return res.status(400).send({ message: 'Invalid request body.' });
    }

    const bulkOps = habitsIds.map((habitId, index) => ({
        updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(habitId) }, // Convert string to ObjectId
            update: { $set: { order: index } } // Use $set to update the "order" field
        }
    }));

    return Habit.collection
        .bulkWrite(bulkOps)
        .then((result) => {
            logging.info(`BulkWrite result: ${JSON.stringify(result)}`);
            return res.status(200).send({ message: 'Habits reordered successfully.' });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info(`Incoming read all habits...`);

    return Habit.find({ author: author_id }).sort({ order: 1 })
        .then((habits) => {
            return res.status(200).json({
                count: habits.length,
                habits: habits
            });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.habitID;

    logging.info(`Incoming read for habit ${_id} ...`);

    return Habit.findById(_id)
        .then((habit) => {
            return res.status(200).json({ habit });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.habitID;

    logging.info(`Incoming update for habit ${_id} ...`);

    return Habit.findById(_id)
        .exec()
        .then((habit) => {
            if (habit) {
                habit.set(req.body);

                habit
                    .save()
                    .then((newHabit) => {
                        logging.info(`Habit updated...`);
                        return res.status(201).json({ habit: newHabit });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'habit not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const deleteHabit = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.habitID;

    logging.info(`Incoming delete for habit ${_id} ...`);

    return Habit.findByIdAndDelete(_id)
        .then(() => {
            return res.status(200).json({ message: `Habit ${_id} was deleted.` });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

export default {
    create,
    reorder,
    read,
    readAll,
    update,
    deleteHabit
};
