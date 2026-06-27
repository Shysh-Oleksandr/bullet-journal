import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';
import {
  CreateImageDto,
  CreateMultipleImagesDto,
} from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';
import { S3UploadService } from './s3-upload.service';

const MEDIA_MIME = /^(image|video)\//;

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly s3UploadService: S3UploadService,
  ) {}

  @Post()
  async create(
    @Body() createImageDto: CreateImageDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const image = await this.imagesService.create(
        createImageDto,
        req.user.userId,
      );
      return { image };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create image');
    }
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 500 * 1024 * 1024 } }))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: RequestWithUser,
  ) {
    if (!files?.length) {
      throw new BadRequestException('No files provided');
    }
    const userId = req.user.userId;
    const urls: string[] = [];
    const mimeTypes: string[] = [];
    for (const file of files) {
      if (!file.mimetype || !MEDIA_MIME.test(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.originalname}`);
      }
      try {
        const url = await this.s3UploadService.uploadImage(
          userId,
          file.buffer,
          file.mimetype,
        );
        urls.push(url);
        mimeTypes.push(file.mimetype);
      } catch (err) {
        console.error('S3 upload failed', {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          error: err?.message,
          code: err?.Code ?? err?.code,
        });
        throw new InternalServerErrorException(
          `S3 upload failed for ${file.originalname} (${file.mimetype}, ${file.size}B): ${err?.message}`,
        );
      }
    }
    return { urls, mimeTypes };
  }

  @Post('bulk')
  async createMany(
    @Body() createMultipleImagesDto: CreateMultipleImagesDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const images = await this.imagesService.createMany(
        createMultipleImagesDto,
        req.user.userId,
      );
      return { images };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create images');
    }
  }

  @Get('user')
  async findAll(@Req() req: RequestWithUser) {
    try {
      const images = await this.imagesService.findAll(req.user.userId);
      return images;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch images');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const image = await this.imagesService.findOne(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return { image };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    const updatedImage = await this.imagesService.update(id, updateImageDto);
    if (!updatedImage) {
      throw new NotFoundException('Image not found');
    }
    return { image: updatedImage };
  }

  @Delete('bulk')
  async removeMany(@Body() body: { imageIds: string[] }) {
    try {
      const count = await this.imagesService.removeMany(body.imageIds);
      return {
        count,
        message: `${count} images were deleted.`,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete images');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.imagesService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Image not found');
    }
    return { message: 'Image was deleted.' };
  }
}
