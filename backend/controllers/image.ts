import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import { uploadToS3 } from '../s3';
import Image from '../models/image';
import mongoose from 'mongoose';
import { sortByCreatedDate } from '../utils/sortByCreatedDate';
import IImage from '../interfaces/image';

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register images...');

    let { urls, noteId, author } = req.body;

    const createdImages: IImage[] = [];

    urls.forEach((url: string) => {
        const image = new Image({
            _id: new mongoose.Types.ObjectId(),
            url,
            noteId,
            author
        });

        createdImages.push(image);

        image
            .save()
            .then(() => {
                logging.info(`New image created...`);
            })
            .catch((error) => {
                logging.error(error);
            });
    });

    return res.status(201).json({ createdImages });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.params.authorID;

    logging.info(`Incoming read all images by ${author_id}...`);

    return Image.find({ author: author_id })
        .then((images) => {
            const sortedImages = sortByCreatedDate(images);

            return res.status(200).json({
                count: images.length,
                images: sortedImages
            });
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.imageID;

    logging.info(`Incoming update for image ${_id} ...`);

    return Image.findById(_id)
        .exec()
        .then((image) => {
            if (image) {
                image.set(req.body);

                image
                    .save()
                    .then((newImage) => {
                        logging.info(`Image updated...`);
                        return res.status(201).json({ image: newImage });
                    })
                    .catch((error) => {
                        logging.error(error);
                        return res.status(500).json({ error });
                    });
            } else {
                return res.status(404).json({ message: 'image not found' });
            }
        })
        .catch((error) => {
            logging.error(error);
            return res.status(500).json({ error });
        });
};

const updateImagesNoteId = (imagesIds: string[] | undefined, noteId: string) => {
    if (!imagesIds) return;

    imagesIds.forEach((imageId) => {
        Image.findById({ _id: imageId })
            .exec()
            .then((image) => {
                if (!image) {
                    logging.info(`Not able to found the image with id ${imageId}`);

                    return;
                }

                logging.info(`Incoming update for image ${image._id} ...`);

                image.set({ noteId });
                image.save();
            })
            .catch((error) => {
                logging.error(error);
            });
    });
};

const deleteImages = (imageIdsToDelete: string[]) => {
    try {
        imageIdsToDelete.forEach((_id) => {
            logging.info(`Incoming delete for image ${_id} ...`);

            Image.findByIdAndDelete(_id)
                .then(() => {
                    logging.info(`Deleted the image ${_id} ...`);
                })
                .catch((error) => {
                    logging.error(error);
                });
        });
    } catch (error) {
        logging.error(error);
    }
};

const deleteImagesHandler = (req: Request, res: Response, next: NextFunction) => {
    let { imageIdsToDelete } = req.body;

    try {
        deleteImages(imageIdsToDelete);
    } catch (error) {
        return res.status(500).json({ error });
    }

    return res.status(200).json({ message: `Images were deleted.` });
};

// Used only for the Web version
const upload = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to upload an image...');

    const { file } = req;

    const userId = req.headers['x-user-id'] as string;

    if (!file || !userId) return res.status(400).json({ message: 'Bad request' });

    const { error, key } = await uploadToS3({ file, userId });

    if (error) {
        return res.status(500).json({ message: 'Internal error while uploading to S3' });
    }

    return res.status(201).json({ url: 'https://bullet-journal.s3.eu-north-1.amazonaws.com/' + key });
};

// Used only for the Web version
const uploadMany = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to upload several images...');

    const files = req.files as Express.Multer.File[];

    const userId = req.headers['x-user-id'] as string;

    if (!files || !files.length || !userId) return res.status(400).json({ message: 'Bad request' });

    const uploadPromises = files.map(async (file) => {
        const { key } = await uploadToS3({ file, userId });
        if (key) {
            return 'https://bullet-journal.s3.eu-north-1.amazonaws.com/' + key;
        }
    });

    const urls = await Promise.all(uploadPromises.filter((url) => !!url) as Promise<string>[]);

    return res.status(201).json({ urls });
};

export default {
    create,
    update,
    updateImagesNoteId,
    readAll,
    deleteImages,
    deleteImagesHandler,
    upload,
    uploadMany
};
