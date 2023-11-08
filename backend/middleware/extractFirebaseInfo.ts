import { NextFunction, Request, Response } from 'express';
import firebaseAdmin from 'firebase-admin';
import logging from '../config/logging';

const extractFirebaseInfo = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Validating firebase token...');

    let { uid } = req.body;

    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logging.info('No firebase token provided, unauthorized...');

        return res.status(401).json({ message: 'unauthorized' });
    }

    firebaseAdmin
        .auth()
        .verifyIdToken(token)
        .then((result) => {
            if (result) {
                // Add info to response
                res.locals.firebase = result;
                res.locals.fire_token = token;
                next();
            } else {
                logging.warn('Token invalid, unauthorized...');

                return res.status(401).json({ message: 'unauthorized' });
            }
        })
        .catch(() => {
            logging.info("Can't verify token, trying to refresh it...");

            firebaseAdmin
                .auth()
                .createCustomToken(uid)
                .then((refreshToken) => {
                    logging.info(`Refresh token for user ${uid} is created, returning...`);

                    // Add info to response
                    res.locals.fire_token = refreshToken;
                    next();
                })
                .catch((error) => {
                    logging.error(error);
                    logging.warn("Can't refresh token, unauthorized...");

                    return res.status(401).json({ message: 'unauthorized' });
                });
        });
};

export default extractFirebaseInfo;
