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
const group_1 = __importDefault(require("../models/group"));
const project_1 = __importDefault(require("../models/project"));
const task_1 = __importDefault(require("../models/task"));
const getAllElements = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorID = req.params.authorID;
    try {
        const groups = yield group_1.default.find({ author: new mongoose_1.default.Types.ObjectId(authorID) });
        const projects = yield project_1.default.find({ author: new mongoose_1.default.Types.ObjectId(authorID) });
        const tasks = yield task_1.default.find({ author: new mongoose_1.default.Types.ObjectId(authorID) });
        return res.status(200).json({ groups, projects, tasks });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to create group...');
    const { name, color, parentGroupId, author } = req.body;
    const group = new group_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        author,
        name,
        color,
        parentGroupId
    });
    return group
        .save()
        .then((newGroup) => {
        logging_1.default.info('New group created...');
        return res.status(201).json({ group: newGroup });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
});
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info('Reading all groups...');
    return group_1.default.find({ author: author_id })
        .then((groups) => {
        return res.status(200).json(groups);
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const read = (req, res, next) => {
    const _id = req.params.groupID;
    logging_1.default.info(`Reading group ${_id}...`);
    return group_1.default.findById(_id)
        .then((group) => {
        return res.status(200).json({ group });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.groupID;
    logging_1.default.info(`Updating group ${_id}...`);
    return group_1.default.findById(_id)
        .then((group) => {
        if (group) {
            group.set(req.body);
            group
                .save()
                .then((updatedGroup) => {
                logging_1.default.info('Group updated...');
                return res.status(201).json({ group: updatedGroup });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'Group not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const deleteGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.groupID;
    logging_1.default.info(`Deleting group ${_id}...`);
    // Delete all associated elements
    yield project_1.default.deleteMany({ groupId: _id });
    yield group_1.default.deleteMany({ parentGroupId: _id });
    return group_1.default.findByIdAndDelete(_id)
        .then(() => {
        return res.status(200).json({ message: `Group ${_id} was deleted.` });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
});
exports.default = {
    create,
    read,
    readAll,
    update,
    deleteGroup,
    getAllElements
};
