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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomLabelsService } from './custom-labels.service';
import { CreateCustomLabelDto } from './dto/create-custom-label.dto';
import { UpdateCustomLabelDto } from './dto/update-custom-label.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';
import { LabelFor } from './custom-label.model';

@Controller('custom-labels')
@UseGuards(JwtAuthGuard)
export class CustomLabelsController {
  constructor(private readonly customLabelsService: CustomLabelsService) {}

  @Post()
  async create(
    @Body() createCustomLabelDto: CreateCustomLabelDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const customLabel = await this.customLabelsService.create(
        createCustomLabelDto,
        req.user.userId,
      );
      return { customLabel };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create custom label');
    }
  }

  @Get('user')
  async findAll(
    @Req() req: RequestWithUser,
    @Query('labelFor') labelFor?: LabelFor,
  ) {
    try {
      const customLabels = await this.customLabelsService.findAll(
        req.user.userId,
        labelFor,
      );
      return customLabels;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch custom labels');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const customLabel = await this.customLabelsService.findOne(id);
      if (!customLabel) {
        throw new NotFoundException('Custom label not found');
      }
      return { customLabel };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch custom label');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomLabelDto: UpdateCustomLabelDto,
  ) {
    const updatedLabel = await this.customLabelsService.update(
      id,
      updateCustomLabelDto,
    );
    if (!updatedLabel) {
      throw new NotFoundException('Custom label not found');
    }
    return { customLabel: updatedLabel };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.customLabelsService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Custom label not found');
    }
    return { message: `Custom label was deleted.` };
  }

  @Post('create-defaults')
  async createDefaults(@Req() req: RequestWithUser) {
    try {
      const defaultLabels = await this.customLabelsService.createDefaultLabels(
        req.user.userId,
      );
      return {
        count: defaultLabels.length,
        message: 'Default labels created successfully',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create default labels');
    }
  }
}
