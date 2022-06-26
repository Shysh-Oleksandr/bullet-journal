import { NextFunction, Request, Response } from 'express';
import firebaseAdmin from 'firebase-admin';
import logging from '../config/logging';

const extractFirebaseInfo = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Validating firebase token...');

    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
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
            .catch((error) => {
                logging.error(error);

                return res.status(401).json({ error, message: 'unauthorized' });
            });
    } else {
        return res.status(401).json({ message: 'unauthorized' });
    }
};

export default extractFirebaseInfo;
