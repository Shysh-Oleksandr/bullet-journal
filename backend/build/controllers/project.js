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
const project_1 = __importDefault(require("../models/project"));
const task_1 = __importDefault(require("../models/task"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to create project...');
    const { name, author, groupId, color, dueDate, target, units, completedAmount, tasks, habitsIds } = req.body;
    const project = new project_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        author,
        groupId,
        color,
        dueDate,
        target,
        units,
        completedAmount,
        tasks,
        habitsIds
    });
    return project
        .save()
        .then((newProject) => {
        logging_1.default.info('New project created...');
        return res.status(201).json({ project: newProject });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
});
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info('Reading all projects...');
    return project_1.default.find({ author: author_id })
        .then((projects) => {
        return res.status(200).json(projects);
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const read = (req, res, next) => {
    const _id = req.params.projectID;
    logging_1.default.info(`Reading project ${_id}...`);
    return project_1.default.findById(_id)
        .then((project) => {
        return res.status(200).json({ project });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.projectID;
    logging_1.default.info(`Updating project ${_id}...`);
    return project_1.default.findById(_id)
        .then((project) => {
        if (project) {
            project.set(req.body);
            project
                .save()
                .then((updatedProject) => {
                logging_1.default.info('Project updated...');
                return res.status(201).json({ project: updatedProject });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'Project not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.projectID;
    logging_1.default.info(`Deleting project ${_id}...`);
    // Delete all associated elements
    yield task_1.default.deleteMany({ projectId: _id });
    return project_1.default.findByIdAndDelete(_id)
        .then(() => {
        return res.status(200).json({ message: `Project ${_id} was deleted.` });
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
    deleteProject
};
