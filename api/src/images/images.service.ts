import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from './image.model';
import {
  CreateImageDto,
  CreateMultipleImagesDto,
} from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

  async create(
    createImageDto: CreateImageDto,
    authorId: string,
  ): Promise<Image> {
    const newImage = new this.imageModel({
      ...createImageDto,
      author: new Types.ObjectId(authorId),
    });

    return newImage.save();
  }

  async createMany(
    createMultipleImagesDto: CreateMultipleImagesDto,
    authorId: string,
  ): Promise<Image[]> {
    const newImages = createMultipleImagesDto.urls.map(
      (url) =>
        new this.imageModel({ url, author: new Types.ObjectId(authorId) }),
    );
    return this.imageModel.insertMany(newImages);
  }

  async findAll(authorId: string): Promise<Image[]> {
    const images = await this.imageModel.find({ author: authorId }).exec();

    // Sort by createdAt in descending order (newest first)
    return images.sort((a, b) => {
      const aTime =
        (a as any).createdAt instanceof Date
          ? (a as any).createdAt.getTime()
          : 0;
      const bTime =
        (b as any).createdAt instanceof Date
          ? (b as any).createdAt.getTime()
          : 0;
      return bTime - aTime;
    });
  }

  async findOne(id: string): Promise<Image | null> {
    return this.imageModel.findById(id).exec();
  }

  async update(
    id: string,
    updateImageDto: UpdateImageDto,
  ): Promise<Image | null> {
    return this.imageModel
      .findByIdAndUpdate(id, updateImageDto, { new: true })
      .exec();
  }

  async updateImagesNoteId(imageIds: string[], noteId: string): Promise<void> {
    if (!imageIds || !imageIds.length) return;

    await this.imageModel
      .updateMany(
        { _id: { $in: imageIds.map((id) => new Types.ObjectId(id)) } },
        { $set: { noteId: new Types.ObjectId(noteId) } },
      )
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.imageModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async removeMany(imageIds: string[]): Promise<number> {
    if (!imageIds || !imageIds.length) return 0;

    const result = await this.imageModel
      .deleteMany({
        _id: { $in: imageIds.map((id) => new Types.ObjectId(id)) },
      })
      .exec();

    return result.deletedCount || 0;
  }
}
