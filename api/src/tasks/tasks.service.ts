import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto, authorId: string): Promise<Task> {
    const newTask = new this.taskModel({
      ...createTaskDto,
      author: new Types.ObjectId(authorId),
    });

    return newTask.save();
  }

  async findAll(authorId: string): Promise<Task[]> {
    const tasks = await this.taskModel
      .find({ author: authorId })
      .populate('customLabels')
      .exec();

    // Sort by createdAt in descending order (oldest first)
    return tasks.sort((a, b) => {
      const aTime =
        (a as any).createdAt instanceof Date
          ? (a as any).createdAt.getTime()
          : 0;
      const bTime =
        (b as any).createdAt instanceof Date
          ? (b as any).createdAt.getTime()
          : 0;
      return aTime - bTime;
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).populate('customLabels').exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    // Delete all subtasks
    await this.taskModel.deleteMany({ parentTaskId: id }).exec();

    const result = await this.taskModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByGroupId(groupId: string): Promise<Task[]> {
    return this.taskModel
      .find({ groupId: new Types.ObjectId(groupId) })
      .populate('customLabels')
      .exec();
  }

  async deleteTasksByGroupId(groupId: string): Promise<number> {
    const result = await this.taskModel
      .deleteMany({ groupId: new Types.ObjectId(groupId) })
      .exec();

    return result.deletedCount || 0;
  }
}
