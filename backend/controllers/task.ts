import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Task from '../models/task';
import Project from '../models/project';

const create = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create task...');

    const { name, parentTaskId, author, dueDate, color, projectId, isCompleted, percentageCompleted } = req.body;

    const task = new Task({
        _id: new mongoose.Types.ObjectId(),
        name,
        author,
        dueDate,
        color,
        projectId,
        isCompleted,
        percentageCompleted,
        parentTaskId
    });

    return task
        .save()
        .then((newTask) => {
            logging.info('New task created...');
            return res.status(201).json({ task: newTask });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info('Reading all tasks...');

    return Task.find({ author: author_id })
        .then((tasks) => {
            return res.status(200).json(tasks);
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.taskID;

    logging.info(`Reading task ${_id}...`);

    return Task.findById(_id)
        .then((task) => {
            return res.status(200).json({ task });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.taskID;

    logging.info(`Updating task ${_id}...`);

    return Task.findById(_id)
        .then((task) => {
            if (task) {
                task.set(req.body);
                task.save()
                    .then((updatedTask) => {
                        logging.info('Task updated...');
                        return res.status(201).json({ task: updatedTask });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'Task not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.taskID;

    logging.info(`Deleting task ${_id}...`);

    // Delete all associated subtasks
    await Task.deleteMany({ parentTaskId: _id });

    return Task.findByIdAndDelete(_id)
        .then(() => {
            return res.status(200).json({ message: `Task ${_id} was deleted.` });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

export default {
    create,
    read,
    readAll,
    update,
    deleteTask
};
