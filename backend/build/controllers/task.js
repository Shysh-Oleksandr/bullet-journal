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
const task_1 = __importDefault(require("../models/task"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to create task...');
    const { name, parentTaskId, author, dueDate, color, groupId, isCompleted, isArchived, target, units, completedAmount } = req.body;
    const task = new task_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        author,
        dueDate,
        groupId,
        color,
        isCompleted,
        target,
        units,
        completedAmount,
        parentTaskId,
        isArchived
    });
    return task
        .save()
        .then((newTask) => {
        logging_1.default.info('New task created...');
        return res.status(201).json({ task: newTask });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
});
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info('Reading all tasks...');
    return task_1.default.find({ author: author_id })
        .then((tasks) => {
        return res.status(200).json(tasks);
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const read = (req, res, next) => {
    const _id = req.params.taskID;
    logging_1.default.info(`Reading task ${_id}...`);
    return task_1.default.findById(_id)
        .then((task) => {
        return res.status(200).json({ task });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.taskID;
    logging_1.default.info(`Updating task ${_id}...`);
    return task_1.default.findById(_id)
        .then((task) => {
        if (task) {
            task.set(req.body);
            task.save()
                .then((updatedTask) => {
                logging_1.default.info('Task updated...');
                return res.status(201).json({ task: updatedTask });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'Task not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.taskID;
    logging_1.default.info(`Deleting task ${_id}...`);
    // Delete all associated subtasks
    yield task_1.default.deleteMany({ parentTaskId: _id });
    return task_1.default.findByIdAndDelete(_id)
        .then(() => {
        return res.status(200).json({ message: `Task ${_id} was deleted.` });
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
    deleteTask
};
