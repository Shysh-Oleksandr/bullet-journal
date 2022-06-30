"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const logging_1 = __importDefault(require("../config/logging"));
const extractFirebaseInfo = (req, res, next) => {
    var _a;
    logging_1.default.info('Validating firebase token...');
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        firebase_admin_1.default
            .auth()
            .verifyIdToken(token)
            .then((result) => {
            if (result) {
                // Add info to response
                res.locals.firebase = result;
                res.locals.fire_token = token;
                next();
            }
            else {
                logging_1.default.warn('Token invalid, unauthorized...');
                return res.status(401).json({ message: 'unauthorized' });
            }
        })
            .catch((error) => {
            logging_1.default.error(error);
            return res.status(401).json({ error, message: 'unauthorized' });
        });
    }
    else {
        return res.status(401).json({ message: 'unauthorized' });
    }
};
exports.default = extractFirebaseInfo;
