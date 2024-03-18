import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Habit from '../models/habit';
import { sortByCreatedDate } from '../utils/sortByCreatedDate';

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register habit...');

    let { label, color, description, author, amountTarget, units, streakTarget, overallTarget, startDate, frequency, habitType, logs } = req.body;

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
        startDate,
        frequency,
        habitType,
        logs
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


const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info(`Incoming read all habits...`);

    return Habit.find({ author: author_id })
        .then((habits) => {
            const sortedHabits = sortByCreatedDate(habits);

            return res.status(200).json({
                count: habits.length,
                habits: sortedHabits
            });
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
    readAll,
    update,
    deleteHabit
};
