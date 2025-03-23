import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const group = await this.groupsService.create(
        createGroupDto,
        req.user.userId,
      );
      return { group };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create group');
    }
  }

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    try {
      const groups = await this.groupsService.findAll(req.user.userId);
      return groups;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch groups');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const group = await this.groupsService.findOne(id);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      return { group };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch group');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    try {
      const updatedGroup = await this.groupsService.update(id, updateGroupDto);
      if (!updatedGroup) {
        throw new NotFoundException('Group not found');
      }
      return { group: updatedGroup };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update group');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.groupsService.remove(id);
      if (!deleted) {
        throw new NotFoundException('Group not found');
      }
      return { message: 'Group was deleted.' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete group');
    }
  }
}
