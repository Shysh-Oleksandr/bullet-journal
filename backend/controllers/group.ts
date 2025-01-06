import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Group from '../models/group';
import Task from '../models/task';

const create = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create group...');

    const { name, color, parentGroupId, author } = req.body;

    const group = new Group({
        _id: new mongoose.Types.ObjectId(),
        author,
        name,
        color,
        parentGroupId
    });

    return group
        .save()
        .then((newGroup) => {
            logging.info('New group created...');
            return res.status(201).json({ group: newGroup });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info('Reading all groups...');

    return Group.find({ author: author_id })
        .then((groups) => {
            return res.status(200).json(groups);
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.groupID;

    logging.info(`Reading group ${_id}...`);

    return Group.findById(_id)
        .then((group) => {
            return res.status(200).json({ group });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.groupID;

    logging.info(`Updating group ${_id}...`);

    return Group.findById(_id)
        .then((group) => {
            if (group) {
                group.set(req.body);
                group
                    .save()
                    .then((updatedGroup) => {
                        logging.info('Group updated...');
                        return res.status(201).json({ group: updatedGroup });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'Group not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.groupID;

    logging.info(`Deleting group ${_id}...`);

    // Delete all associated elements
    await Task.deleteMany({ groupId: _id });
    await Group.deleteMany({ parentGroupId: _id });

    return Group.findByIdAndDelete(_id)
        .then(() => {
            return res.status(200).json({ message: `Group ${_id} was deleted.` });
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
    deleteGroup
};
