import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  CreateImageDto,
  CreateMultipleImagesDto,
} from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

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
