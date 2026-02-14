import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { S3UploadService } from './s3-upload.service';
import { Image, ImageSchema } from './image.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, S3UploadService],
  exports: [ImagesService],
})
export class ImagesModule {}
