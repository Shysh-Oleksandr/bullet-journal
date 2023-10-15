"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            autoIndex: false,
            retryWrites: false
        },
        url: (_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : ''
    },
    server: {
        host: 'localhost',
        port: process.env.PORT || 8001
    },
    security: {
        charCodeShiftNumber: (_b = process.env.CHAR_CODE_SHIFT_NUMBER) !== null && _b !== void 0 ? _b : 1
    }
};
exports.default = config;
