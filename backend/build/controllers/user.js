"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("../config/logging"));
const user_1 = __importDefault(require("../models/user"));
const note_1 = __importDefault(require("../controllers/note"));
const customLabel_1 = __importDefault(require("../controllers/customLabel"));
const note_2 = require("../interfaces/note");
const customLabel_2 = require("../interfaces/customLabel");
const validate = (req, res, next) => {
    logging_1.default.info('Try to validate token...');
    const { uid } = req.body;
    const fire_token = res.locals.fire_token;
    return user_1.default.findOne({ uid })
        .then((user) => {
        if (user) {
            logging_1.default.info('Token validated, returning user and a fire token...');
            return res.status(200).json({ user, fire_token });
        }
        else {
            return res.status(401).json({ message: 'user not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const createDefaultData = (userId) => {
    logging_1.default.info(`Attempting to create default custom labels...`);
    return Promise.all(customLabel_2.DEFAULT_LABELS.map((labelData) => customLabel_1.default.createDefaultLabel(labelData, userId)))
        .then((createdLabels) => {
        logging_1.default.info(`All default custom labels created...`);
        logging_1.default.info(`Attempting to create default notes...`);
        const noteTypeId = createdLabels ? createdLabels[0].toString() : null;
        Promise.all(note_2.DEFAULT_NOTES.map((noteData) => note_1.default.createDefaultNote(noteData, userId, noteTypeId, [])))
            .then(() => {
            logging_1.default.info(`All default notes created.`);
        })
            .catch((error) => {
            logging_1.default.error(error);
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
    });
};
const createDefaultDataForExistingUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to create default data for existing users...');
    try {
        const existingUsers = yield user_1.default.find({});
        for (const user of existingUsers) {
            const userId = user._id.toString();
            yield createDefaultData(userId);
        }
        logging_1.default.info('Success! Default data for existing users is created!');
        return res.status(201).json({ message: 'Success! Default data for existing users is created!' });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    }
});
const create = (req, res, next) => {
    logging_1.default.info('Attempting to register user...');
    const { uid, name } = req.body;
    const fire_token = res.locals.fire_token;
    const newUserId = new mongoose_1.default.Types.ObjectId();
    const user = new user_1.default({
        _id: newUserId,
        uid,
        name
    });
    return user
        .save()
        .then((newUser) => {
        logging_1.default.info(`New user ${uid} created...`);
        const userId = newUserId.toString();
        createDefaultData(userId)
            .then(() => {
            return res.status(201).json({ user: newUser, fire_token });
        })
            .catch((error) => {
            logging_1.default.error(error);
            return res.status(500).json({ error });
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.userID;
    logging_1.default.info(`Incoming update for ${_id} ...`);
    return user_1.default.findById(_id)
        .exec()
        .then((user) => {
        if (user) {
            user.set(req.body);
            user.save()
                .then((newUser) => {
                logging_1.default.info(`User updated...`);
                return res.status(201).json({ user: newUser });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'user not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const login = (req, res, next) => {
    logging_1.default.info('Logging in user...');
    const { uid } = req.body;
    const fire_token = res.locals.fire_token;
    return user_1.default.findOne({ uid })
        .then((user) => {
        if (user) {
            logging_1.default.info(`User ${uid} found, signing in...`);
            return res.status(200).json({ user, fire_token });
        }
        else {
            logging_1.default.info(`User ${uid} not found, register...`);
            return create(req, res, next);
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const read = (req, res, next) => {
    const _id = req.params.userID;
    logging_1.default.info(`Incoming read for ${_id} ...`);
    return user_1.default.findById(_id)
        .then((user) => {
        if (user) {
            return res.status(200).json({ user });
        }
        else {
            return res.status(404).json({ message: 'user not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const readAll = (req, res, next) => {
    logging_1.default.info(`Incoming read all...`);
    return user_1.default.find()
        .exec()
        .then((users) => {
        return res.status(200).json({
            count: users.length,
            users
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
exports.default = {
    validate,
    create,
    login,
    read,
    update,
    readAll,
    createDefaultDataForExistingUsers
};
