import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import User from '../models/user';
import noteController from '../controllers/note';
import customLabelController from '../controllers/customLabel';
import { DEFAULT_NOTES } from '../interfaces/note';
import { DEFAULT_LABELS } from '../interfaces/customLabel';
import firebaseAdmin from 'firebase-admin';

const validate = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Token validated, returning user...');

    let firebase = res.locals.firebase;

    return User.findOne({ uid: firebase.uid })
        .then((user) => {
            if (user) {
                return res.status(200).json({ user });
            } else {
                return res.status(401).json({ message: 'user not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Trying to refresh the token by uid');

    let { uid } = req.body;
    firebaseAdmin
        .auth()
        .createCustomToken(uid)
        .then((refreshToken) => {
            logging.info(`Refresh token for user ${uid} is created, returning...`);
            return res.status(200).json({ refreshToken });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const createDefaultData = (userId: string) => {
    logging.info(`Attempting to create default custom labels...`);
    return Promise.all(DEFAULT_LABELS.map((labelData) => customLabelController.createDefaultLabel(labelData, userId)))
        .then((createdLabels) => {
            logging.info(`All default custom labels created...`);

            logging.info(`Attempting to create default notes...`);
            const noteTypeId = createdLabels ? createdLabels[0].toString() : null;

            Promise.all(DEFAULT_NOTES.map((noteData) => noteController.createDefaultNote(noteData, userId, noteTypeId, [])))
                .then(() => {
                    logging.info(`All default notes created.`);
                })
                .catch((error) => {
                    logging.error(error);
                });
        })
        .catch((error) => {
            logging.error(error);
        });
};

const createDefaultDataForExistingUsers = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create default data for existing users...');

    try {
        const existingUsers = await User.find({});

        for (const user of existingUsers) {
            const userId = user._id.toString();

            await createDefaultData(userId);
        }

        logging.info('Success! Default data for existing users is created!');
        return res.status(201).json({ message: 'Success! Default data for existing users is created!' });
    } catch (error) {
        logging.error(error);
        return res.status(500).json({ error });
    }
};

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register user...');

    let { uid, name } = req.body;
    let fire_token = res.locals.fire_token;

    const newUserId = new mongoose.Types.ObjectId();

    const user = new User({
        _id: newUserId,
        uid,
        name
    });

    return user
        .save()
        .then((newUser) => {
            logging.info(`New user ${uid} created...`);

            const userId = newUserId.toString();

            createDefaultData(userId)
                .then(() => {
                    return res.status(201).json({ user: newUser, fire_token });
                })
                .catch((error) => {
                    logging.error(error);
                    return res.status(500).json({ error });
                });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.userID;

    logging.info(`Incoming update for ${_id} ...`);

    return User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                user.set(req.body);

                user.save()
                    .then((newUser) => {
                        logging.info(`User updated...`);
                        return res.status(201).json({ user: newUser });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'user not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Logging in user...');

    let { uid } = req.body;
    let fire_token = res.locals.fire_token;

    return User.findOne({ uid })
        .then((user) => {
            if (user) {
                logging.info(`User ${uid} found, signing in...`);
                return res.status(200).json({ user, fire_token });
            } else {
                logging.info(`User ${uid} not found, register...`);

                return create(req, res, next);
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.userID;

    logging.info(`Incoming read for ${_id} ...`);

    return User.findById(_id)
        .then((user) => {
            if (user) {
                return res.status(200).json({ user });
            } else {
                return res.status(404).json({ message: 'user not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    logging.info(`Incoming read all...`);

    return User.find()
        .exec()
        .then((users) => {
            return res.status(200).json({
                count: users.length,
                users
            });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

export default {
    validate,
    refreshToken,
    create,
    login,
    read,
    update,
    readAll,
    createDefaultDataForExistingUsers
};
