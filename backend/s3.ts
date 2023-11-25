import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import logging from './config/logging';

const s3 = new S3Client();
const BUCKET = process.env.BUCKET;

export const uploadToS3 = async ({ file, userId }: { file: Express.Multer.File; userId: string }) => {
    const key = `${userId}/${uuid()}`;
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: file.buffer, ContentType: file.mimetype });

    try {
        await s3.send(command);

        return { key };
    } catch (error) {
        logging.error(error);

        return { error };
    }
};
