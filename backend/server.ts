import express from 'express';
import firebaseAdmin from 'firebase-admin';
import mongoose from 'mongoose';
import config from './config/config';
import logging from './config/logging';
import serviceAccountJson from './config/serviceAccountKey.json';
import customLabelRoutes from './routes/customLabel';
import imageRoutes from './routes/image';
import noteRoutes from './routes/note';
import userRoutes from './routes/user';

const router = express();

/** Connect to Firebase */
let serviceAccount: any = serviceAccountJson;

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info('Mongo Connected');
    })
    .catch((error) => {
        logging.error(error);
    });

/** Log the request */
router.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/users', userRoutes);
router.use('/notes', noteRoutes);
router.use('/customlabels', customLabelRoutes);
router.use('/images', imageRoutes);

/** Special route for the cron job(for keeping the server constantly active) */
router.get('/cron-job', (_, res) => {
  res.send('Hello World!')
})

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

/** Listen */
router.listen(config.server.port, () => logging.info(`Server is running ${config.server.host}:${config.server.port}`));
