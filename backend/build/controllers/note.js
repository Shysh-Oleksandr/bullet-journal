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
const note_1 = __importDefault(require("../models/note"));
const security_1 = require("../utils/security");
const image_1 = __importDefault(require("../controllers/image"));
const create = (req, res, next) => {
    logging_1.default.info('Attempting to register note...');
    let { title, author, startDate, endDate, content, color, images, type, category, rating, isStarred } = req.body;
    const obfTitle = (0, security_1.obfuscateText)(title);
    const obfContent = (0, security_1.obfuscateText)(content);
    const newNoteId = new mongoose_1.default.Types.ObjectId();
    const note = new note_1.default({
        _id: newNoteId,
        title: obfTitle,
        author,
        startDate,
        endDate,
        content: obfContent,
        color,
        images,
        type: type !== null && type !== void 0 ? type : null,
        category,
        rating,
        isStarred,
        isLocked: false
    });
    image_1.default.updateImagesNoteId(images, newNoteId.toString());
    return note
        .save()
        .then((newNote) => {
        logging_1.default.info(`New note created...`);
        return res.status(201).json({ note: newNote });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
// Note: it's enough to pass just the id of a User or CustomLabel objects in order to create a note
const createDefaultNote = (noteData, author, type, category) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    logging_1.default.info('Attempting to create a default note...');
    const note = new note_1.default(Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, noteData), { author,
        type,
        category }));
    const obfTitle = (0, security_1.obfuscateText)(note.title);
    const obfContent = (0, security_1.obfuscateText)((_a = note.content) !== null && _a !== void 0 ? _a : '');
    obfTitle && note.set({ title: obfTitle });
    obfContent && note.set({ content: obfContent });
    note.save()
        .then(() => {
        logging_1.default.info(`New default note created...`);
    })
        .catch((error) => {
        logging_1.default.error(error);
    });
});
const read = (req, res, next) => {
    const _id = req.params.noteID;
    logging_1.default.info(`Incoming read for ${_id} ...`);
    return note_1.default.findById(_id)
        .populate('type')
        .populate('category')
        .populate('images')
        .then((note) => {
        var _a;
        if (note) {
            const deobfTitle = (0, security_1.deobfuscateText)(note.title);
            const deobfContent = (0, security_1.deobfuscateText)((_a = note.content) !== null && _a !== void 0 ? _a : '');
            deobfTitle && note.set({ title: deobfTitle });
            deobfContent && note.set({ content: deobfContent });
            return res.status(200).json({ note });
        }
        else {
            return res.status(404).json({ message: 'note not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info(`Incoming read all...`);
    return note_1.default.find({ author: author_id })
        .populate('type')
        .populate('category')
        .populate('images')
        .exec()
        .then((notes) => {
        notes.forEach((note) => {
            var _a;
            const deobfTitle = (0, security_1.deobfuscateText)(note.title);
            const deobfContent = (0, security_1.deobfuscateText)((_a = note.content) !== null && _a !== void 0 ? _a : '');
            deobfTitle && note.set({ title: deobfTitle });
            deobfContent && note.set({ content: deobfContent });
        });
        const sortedNotes = notes.slice().sort((a, b) => b.startDate - a.startDate);
        return res.status(200).json({
            count: sortedNotes.length,
            notes: sortedNotes
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const query = (req, res, next) => {
    const { title } = req.query;
    const author_id = req.params.authorID;
    logging_1.default.info(`Incoming query...`);
    const titleRegex = title ? new RegExp(title.toString(), 'i') : new RegExp('');
    return note_1.default.find({ title: { $regex: titleRegex }, author: author_id })
        .populate('type')
        .populate('category')
        .populate('images')
        .exec()
        .then((notes) => {
        notes.forEach((note) => {
            var _a;
            const deobfTitle = (0, security_1.deobfuscateText)(note.title);
            const deobfContent = (0, security_1.deobfuscateText)((_a = note.content) !== null && _a !== void 0 ? _a : '');
            deobfTitle && note.set({ title: deobfTitle });
            deobfContent && note.set({ content: deobfContent });
        });
        return res.status(200).json({
            count: notes.length,
            notes
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.noteID;
    logging_1.default.info(`Incoming update for ${_id} ...`);
    return note_1.default.findById(_id)
        .exec()
        .then((note) => {
        var _a, _b;
        if (note) {
            const title = (_a = req.body) === null || _a === void 0 ? void 0 : _a.title;
            const content = (_b = req.body) === null || _b === void 0 ? void 0 : _b.content;
            const obfTitle = (0, security_1.obfuscateText)(title);
            const obfContent = (0, security_1.obfuscateText)(content);
            note.set(req.body);
            obfTitle && note.set({ title: obfTitle });
            obfContent && note.set({ content: obfContent });
            note.save()
                .then((newNote) => {
                logging_1.default.info(`Note updated...`);
                return res.status(201).json({ note: newNote });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'note not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const deleteNote = (req, res, next) => {
    const _id = req.params.noteID;
    logging_1.default.info(`Incoming delete for note ${_id} ...`);
    return note_1.default.findByIdAndDelete(_id)
        .then((note) => {
        (note === null || note === void 0 ? void 0 : note.images) && image_1.default.deleteImages(note === null || note === void 0 ? void 0 : note.images);
        return res.status(200).json({ message: 'Note was deleted.' });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
exports.default = {
    create,
    createDefaultNote,
    read,
    readAll,
    query,
    update,
    deleteNote
};
