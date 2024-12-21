import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import { CreateDefaultNotePayload } from '../interfaces/note';
import Note from '../models/note';
import { obfuscateText, deobfuscateText } from '../utils/security';
import imageController from '../controllers/image';

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register note...');

    let { title, author, startDate, endDate, content, color, images, type, category, rating, isStarred } = req.body;

    const obfTitle = obfuscateText(title);
    const obfContent = obfuscateText(content);

    const newNoteId = new mongoose.Types.ObjectId();

    const note = new Note({
        _id: newNoteId,
        title: obfTitle,
        author,
        startDate,
        endDate,
        content: obfContent,
        color,
        images,
        type: type ?? null,
        category,
        rating,
        isStarred,
        isLocked: false
    });

    imageController.updateImagesNoteId(images, newNoteId.toString());

    return note
        .save()
        .then((newNote) => {
            logging.info(`New note created...`);
            return res.status(201).json({ note: newNote });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

// Note: it's enough to pass just the id of a User or CustomLabel objects in order to create a note
const createDefaultNote = async (noteData: CreateDefaultNotePayload, author: string, type: string | null, category: string[]) => {
    logging.info('Attempting to create a default note...');

    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        ...noteData,
        author,
        type,
        category,
        startDate: new Date().getTime(),
    });

    const obfTitle = obfuscateText(note.title);
    const obfContent = obfuscateText(note.content ?? '');

    obfTitle && note.set({ title: obfTitle });
    obfContent && note.set({ content: obfContent });

    note.save()
        .then(() => {
            logging.info(`New default note created...`);
        })
        .catch((error) => {
            logging.error(error);
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.noteID;

    logging.info(`Incoming read for ${_id} ...`);

    return Note.findById(_id)
        .populate('type')
        .populate('category')
        .populate('images')
        .then((note) => {
            if (note) {
                const deobfTitle = deobfuscateText(note.title);
                const deobfContent = deobfuscateText(note.content ?? '');

                deobfTitle && note.set({ title: deobfTitle });
                deobfContent && note.set({ content: deobfContent });
                return res.status(200).json({ note });
            } else {
                return res.status(404).json({ message: 'note not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info(`Incoming read all...`);

    return Note.find({ author: author_id })
        .populate('type')
        .populate('category')
        .populate('images')
        .exec()
        .then((notes) => {
            notes.forEach((note) => {
                const deobfTitle = deobfuscateText(note.title);
                const deobfContent = deobfuscateText(note.content ?? '');

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
            logging.error(error);
            return res.status(500).json({ error });
        });
}; 

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.noteID;

    logging.info(`Incoming update for ${_id} ...`);

    return Note.findById(_id)
        .exec()
        .then((note) => {
            if (note) {
                const title = req.body?.title;
                const content = req.body?.content;

                const obfTitle = obfuscateText(title);
                const obfContent = obfuscateText(content);

                const {_id, __v, ...rest} = req.body;
                note.set(rest);

                obfTitle && note.set({ title: obfTitle });
                obfContent && note.set({ content: obfContent });

                delete note.__v;
                delete note._id;

                note.save()
                    .then((newNote) => {
                        logging.info(`Note updated...`);
                        return res.status(201).json({ note: newNote });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'note not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const deleteNote = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.noteID;

    logging.info(`Incoming delete for note ${_id} ...`);

    return Note.findByIdAndDelete(_id)
        .then((note) => {
            note?.images && imageController.deleteImages(note?.images);

            return res.status(200).json({ message: 'Note was deleted.' });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

export default {
    create,
    createDefaultNote,
    read,
    readAll,
    update,
    deleteNote
};
