import e, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import CustomLabel from '../models/customLabel';

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register customLabel...');

    let { labelName, color, isCategoryLabel, user } = req.body;

    const customLabel = new CustomLabel({
        _id: new mongoose.Types.ObjectId(),
        labelName,
        color,
        isCategoryLabel,
        user
    });

    return customLabel
        .save()
        .then((newCustomLabel) => {
            logging.info(`New custom label created...`);
            return res.status(201).json({ customLabel: newCustomLabel });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info(`Incoming read all...`);

    return CustomLabel.find({ user: author_id })
        .then((customLabels) => {
            return res.status(200).json({
                count: customLabels.length,
                customLabels
            });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.customLabelID;

    logging.info(`Incoming update for ${_id} ...`);

    return CustomLabel.findById(_id)
        .exec()
        .then((customLabel) => {
            if (customLabel) {
                customLabel.set(req.body);

                customLabel
                    .save()
                    .then((newCustomLabel) => {
                        logging.info(`CustomLabel updated...`);
                        return res.status(201).json({ customLabel: newCustomLabel });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'customLabel not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const deleteCustomLabel = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.customLabelID;

    logging.info(`Incoming delete for ${_id} ...`);

    return CustomLabel.findByIdAndDelete(_id)
        .then((customLabel) => {
            return res.status(200).json({ message: `CustomLabel ${_id} was deleted.` });
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
    deleteCustomLabel
};
