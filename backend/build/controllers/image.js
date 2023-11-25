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
const logging_1 = __importDefault(require("../config/logging"));
const s3_1 = require("../s3");
const image_1 = __importDefault(require("../models/image"));
const mongoose_1 = __importDefault(require("mongoose"));
const sortByCreatedDate_1 = require("../utils/sortByCreatedDate");
const create = (req, res, next) => {
    logging_1.default.info('Attempting to register images...');
    let { urls, noteId, author } = req.body;
    const createdImages = [];
    urls.forEach((url) => {
        const image = new image_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            url,
            noteId,
            author
        });
        createdImages.push(image);
        image
            .save()
            .then(() => {
            logging_1.default.info(`New image created...`);
        })
            .catch((error) => {
            logging_1.default.error(error);
        });
    });
    return res.status(201).json({ createdImages });
};
const readAll = (req, res, next) => {
    const author_id = req.params.authorID;
    logging_1.default.info(`Incoming read all images by ${author_id}...`);
    return image_1.default.find({ author: author_id })
        .then((images) => {
        const sortedImages = (0, sortByCreatedDate_1.sortByCreatedDate)(images);
        return res.status(200).json({
            count: images.length,
            images: sortedImages
        });
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const update = (req, res, next) => {
    const _id = req.params.imageID;
    logging_1.default.info(`Incoming update for image ${_id} ...`);
    return image_1.default.findById(_id)
        .exec()
        .then((image) => {
        if (image) {
            image.set(req.body);
            image
                .save()
                .then((newImage) => {
                logging_1.default.info(`Image updated...`);
                return res.status(201).json({ image: newImage });
            })
                .catch((error) => {
                logging_1.default.error(error);
                return res.status(500).json({ error });
            });
        }
        else {
            return res.status(404).json({ message: 'image not found' });
        }
    })
        .catch((error) => {
        logging_1.default.error(error);
        return res.status(500).json({ error });
    });
};
const updateImagesNoteId = (imagesIds, noteId) => {
    if (!imagesIds)
        return;
    imagesIds.forEach((imageId) => {
        image_1.default.findById({ _id: imageId })
            .exec()
            .then((image) => {
            if (!image) {
                logging_1.default.info(`Not able to found the image with id ${imageId}`);
                return;
            }
            logging_1.default.info(`Incoming update for image ${image._id} ...`);
            image.set({ noteId });
            image.save();
        })
            .catch((error) => {
            logging_1.default.error(error);
        });
    });
};
const deleteImages = (imageIdsToDelete) => {
    try {
        imageIdsToDelete.forEach((_id) => {
            logging_1.default.info(`Incoming delete for image ${_id} ...`);
            image_1.default.findByIdAndDelete(_id)
                .then(() => {
                logging_1.default.info(`Deleted the image ${_id} ...`);
            })
                .catch((error) => {
                logging_1.default.error(error);
            });
        });
    }
    catch (error) {
        logging_1.default.error(error);
    }
};
const deleteImagesHandler = (req, res, next) => {
    let { imageIdsToDelete } = req.body;
    try {
        deleteImages(imageIdsToDelete);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
    return res.status(200).json({ message: `Images were deleted.` });
};
// Used only for the Web version
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to upload an image...');
    const { file } = req;
    const userId = req.headers['x-user-id'];
    if (!file || !userId)
        return res.status(400).json({ message: 'Bad request' });
    const { error, key } = yield (0, s3_1.uploadToS3)({ file, userId });
    if (error) {
        return res.status(500).json({ message: 'Internal error while uploading to S3' });
    }
    return res.status(201).json({ url: 'https://bullet-journal.s3.eu-north-1.amazonaws.com/' + key });
});
// Used only for the Web version
const uploadMany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info('Attempting to upload several images...');
    const files = req.files;
    const userId = req.headers['x-user-id'];
    if (!files || !files.length || !userId)
        return res.status(400).json({ message: 'Bad request' });
    const uploadPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const { key } = yield (0, s3_1.uploadToS3)({ file, userId });
        if (key) {
            return 'https://bullet-journal.s3.eu-north-1.amazonaws.com/' + key;
        }
    }));
    const urls = yield Promise.all(uploadPromises.filter((url) => !!url));
    return res.status(201).json({ urls });
});
exports.default = {
    create,
    update,
    updateImagesNoteId,
    readAll,
    deleteImages,
    deleteImagesHandler,
    upload,
    uploadMany
};
