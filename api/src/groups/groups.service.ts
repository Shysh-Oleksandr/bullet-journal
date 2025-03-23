import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from './group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    private tasksService: TasksService,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    authorId: string,
  ): Promise<Group> {
    const newGroup = new this.groupModel({
      ...createGroupDto,
      author: new Types.ObjectId(authorId),
    });

    return newGroup.save();
  }

  async findAll(authorId: string): Promise<Group[]> {
    const groups = await this.groupModel
      .find({ author: authorId })
      .populate('customLabels')
      .exec();

    // Sort by createdAt in descending order (oldest first)
    return groups.sort((a, b) => {
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

  async findOne(id: string): Promise<Group | null> {
    return this.groupModel.findById(id).populate('customLabels').exec();
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null> {
    return this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    // First, delete all tasks associated with this group
    await this.tasksService.deleteTasksByGroupId(id);

    // Delete all child groups
    await this.groupModel.deleteMany({ parentGroupId: id }).exec();

    const result = await this.groupModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
