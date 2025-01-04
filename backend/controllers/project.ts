import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import Group from '../models/group';
import Project from '../models/project';
import Task from '../models/task';

const create = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create project...');

    const { name, author, groupId, color, dueDate, target, units, completedAmount, tasks, habitsIds } = req.body;

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
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
            logging.info('New project created...');
            return res.status(201).json({ project: newProject });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info('Reading all projects...');

    return Project.find({ author: author_id })
        .then((projects) => {
            return res.status(200).json(projects);
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.projectID;

    logging.info(`Reading project ${_id}...`);

    return Project.findById(_id)
        .then((project) => {
            return res.status(200).json({ project });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.projectID;

    logging.info(`Updating project ${_id}...`);

    return Project.findById(_id)
        .then((project) => {
            if (project) {
                project.set(req.body);
                project
                    .save()
                    .then((updatedProject) => {
                        logging.info('Project updated...');
                        return res.status(201).json({ project: updatedProject });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'Project not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.projectID;

    logging.info(`Deleting project ${_id}...`);

    // Delete all associated elements
    await Task.deleteMany({ projectId: _id });

    return Project.findByIdAndDelete(_id)
        .then(() => {
            return res.status(200).json({ message: `Project ${_id} was deleted.` });
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
    update,
    deleteProject
};
