"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const logging_1 = __importDefault(require("./config/logging"));
const serviceAccountKey_json_1 = __importDefault(require("./config/serviceAccountKey.json"));
const customLabel_1 = __importDefault(require("./routes/customLabel"));
const image_1 = __importDefault(require("./routes/image"));
const note_1 = __importDefault(require("./routes/note"));
const user_1 = __importDefault(require("./routes/user"));
const habit_1 = __importDefault(require("./routes/habit"));
const group_1 = __importDefault(require("./routes/group"));
const task_1 = __importDefault(require("./routes/task"));
const router = (0, express_1.default)();
/** Connect to Firebase */
let serviceAccount = serviceAccountKey_json_1.default;
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
/** Connect to Mongo */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info('Mongo Connected');
})
    .catch((error) => {
    logging_1.default.error(error);
});
/** Log the request */
router.use((req, res, next) => {
    logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request */
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
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
router.use('/users', user_1.default);
router.use('/notes', note_1.default);
router.use('/customlabels', customLabel_1.default);
router.use('/images', image_1.default);
router.use('/habits', habit_1.default);
router.use('/groups', group_1.default);
router.use('/tasks', task_1.default);
/** Special route for the cron job(for keeping the server constantly active) */
router.get('/cron-job', (_, res) => {
    res.send('Hello World!');
});
/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
/** Listen */
router.listen(config_1.default.server.port, () => logging_1.default.info(`Server is running ${config_1.default.server.host}:${config_1.default.server.port}`));
