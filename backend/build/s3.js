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
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const logging_1 = __importDefault(require("./config/logging"));
const s3 = new client_s3_1.S3Client();
const BUCKET = process.env.BUCKET;
const uploadToS3 = ({ file, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `${userId}/${(0, uuid_1.v4)()}`;
    const command = new client_s3_1.PutObjectCommand({ Bucket: BUCKET, Key: key, Body: file.buffer, ContentType: file.mimetype });
    try {
        yield s3.send(command);
        return { key };
    }
    catch (error) {
        logging_1.default.error(error);
        return { error };
    }
});
exports.uploadToS3 = uploadToS3;
