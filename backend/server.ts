import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';
import serviceAccountJson from './config/serviceAccountKey.json';
import userRoutes from './routes/user';
import noteRoutes from './routes/note';
import path from 'path';

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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/users', userRoutes);
router.use('/notes', noteRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

// "heroku-postbuild": "cd frontend && npm install && npm run build"

// Deployment Middleware
router.use(express.static(path.join(__dirname, '/frontend/build')));

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

/** Listen */
router.listen(config.server.port, () => logging.info(`Server is running ${config.server.host}:${config.server.port}`));
