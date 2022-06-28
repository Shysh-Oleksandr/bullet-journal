import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import User from '../models/user';

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

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register user...');

    let { uid, name } = req.body;
    let fire_token = res.locals.fire_token;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        uid,
        name
    });

    return user
        .save()
        .then((newUser) => {
            logging.info(`New user ${uid} created...`);
            return res.status(201).json({ user: newUser, fire_token });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Loggin in user...');

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
    create,
    login,
    read,
    readAll
};
