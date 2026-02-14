import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly imageBaseUrl: string | undefined;

  constructor() {
    const region = process.env.AWS_REGION ?? 'eu-north-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    this.bucket = process.env.BUCKET ?? 'bullet-journal';
    this.region = region;
    this.imageBaseUrl = process.env.S3_IMAGE_BASE_URL;

    this.s3 = new S3Client({
      region,
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}),
    });
  }

  /**
   * Extract S3 key from a full image URL (our URLs end with userId/uuid).
   */
  private keyFromUrl(url: string): string | null {
    try {
      const u = new URL(url);
      const path = u.pathname.replace(/^\//, '');
      return path || null;
    } catch {
      return null;
    }
  }

  /** Delete an image from S3 by its public URL. */
  async deleteByUrl(url: string): Promise<void> {
    const key = this.keyFromUrl(url);
    if (!key) return;
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  /**
   * Upload a file buffer to S3 and return the public URL.
   * Key format: {userId}/{uuid} (no file extension to match Expo app).
   */
  async uploadImage(
    userId: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const key = `${userId}/${uuid()}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    if (this.imageBaseUrl) {
      const base = this.imageBaseUrl.replace(/\/$/, '');
      return `${base}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
