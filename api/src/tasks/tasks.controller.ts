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
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const task = await this.tasksService.create(
        createTaskDto,
        req.user.userId,
      );
      return { task };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create task');
    }
  }

  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query('groupId') groupId?: string,
  ) {
    try {
      if (groupId) {
        const tasks = await this.tasksService.findByGroupId(groupId);
        return tasks;
      } else {
        const tasks = await this.tasksService.findAll(req.user.userId);
        return tasks;
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch tasks');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.tasksService.findOne(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return { task };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch task');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await this.tasksService.update(id, updateTaskDto);
      if (!updatedTask) {
        throw new NotFoundException('Task not found');
      }
      return { task: updatedTask };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update task');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.tasksService.remove(id);
      if (!deleted) {
        throw new NotFoundException('Task not found');
      }
      return { message: 'Task was deleted.' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete task');
    }
  }
}
