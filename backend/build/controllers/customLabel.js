"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("../config/logging"));
const customLabel_1 = __importDefault(require("../models/customLabel"));
const create = (req, res, next) => {
    logging_1.default.info('Attempting to register customLabel...');
    let { labelName, color, isCategoryLabel, user } = req.body;
    const customLabel = new customLabel_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        labelName,
        color,
        isCategoryLabel,
        user
    });
    return customLabel
        .save()
        .then((newCustomLabel) => {
        logging_1.default.info(`New custom label created...`);
        return res.status(201).json({ customLabel: newCustomLabel });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const createDefaultLabel = (defaultLabel, user) => {
    logging_1.default.info('Attempting to create a default customLabel...');
    const customLabel = new customLabel_1.default(Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, defaultLabel), { user }));
    customLabel
        .save()
        .then(() => {
        logging_1.default.info(`New default custom label created...`);
    })
        .catch((error) => {
        logging_1.default.error(error);
    });
    return customLabel._id;
};
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info(`Incoming read all...`);
    return customLabel_1.default.find({ user: author_id })
        .then((customLabels) => {
        return res.status(200).json({
            count: customLabels.length,
            customLabels
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.customLabelID;
    logging_1.default.info(`Incoming update for ${_id} ...`);
    return customLabel_1.default.findById(_id)
        .exec()
        .then((customLabel) => {
        if (customLabel) {
            customLabel.set(req.body);
            customLabel
                .save()
                .then((newCustomLabel) => {
                logging_1.default.info(`CustomLabel updated...`);
                return res.status(201).json({ customLabel: newCustomLabel });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'customLabel not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const deleteCustomLabel = (req, res, next) => {
    const _id = req.params.customLabelID;
    logging_1.default.info(`Incoming delete for ${_id} ...`);
    return customLabel_1.default.findByIdAndDelete(_id)
        .then((customLabel) => {
        return res.status(200).json({ message: `CustomLabel ${_id} was deleted.` });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
exports.default = {
    create,
    createDefaultLabel,
    readAll,
    update,
    deleteCustomLabel
};
