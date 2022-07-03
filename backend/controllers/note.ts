import e, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Note from '../models/note';

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register note...');

    let { title, author, startDate, endDate, content, color, image, type, category, rating } = req.body;

    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        title,
        author,
        startDate,
        endDate,
        content,
        color,
        image,
        type,
        category,
        rating
    });

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

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.noteID;

    logging.info(`Incoming read for ${_id} ...`);

    return Note.findById(_id)
        .populate('author')
        .then((note) => {
            if (note) {
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
        .populate('author')
        .exec()
        .then((notes) => {
            return res.status(200).json({
                count: notes.length,
                notes
            });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const query = (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;
    const author_id = req.params.authorID;

    logging.info(`Incoming query...`);

    const regex = (q && new RegExp(q.toString(), 'i')) || '';
    return Note.find({ title: { $regex: regex }, author: author_id })
        .exec()
        .then((notes) => {
            return res.status(200).json({
                count: notes.length,
                notes
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
                note.set(req.body);

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

    logging.info(`Incoming delete for ${_id} ...`);

    return Note.findByIdAndDelete(_id)
        .then((note) => {
            return res.status(200).json({ message: 'Note was deleted.' });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

export default {
    create,
    read,
    readAll,
    query,
    update,
    deleteNote
};
