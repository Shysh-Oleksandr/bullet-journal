import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Habit } from './habit.model';
import { HabitLog } from './habit-log.model';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    @InjectModel(HabitLog.name) private habitLogModel: Model<HabitLog>,
  ) {}

  async create(createHabitDto: CreateHabitDto, authorId: string) {
    const count = await this.habitModel.countDocuments({ author: authorId });
    const newHabit = new this.habitModel({
      ...createHabitDto,
      author: new Types.ObjectId(authorId),
      order: count,
    });
    return newHabit.save();
  }

  async findAll(authorId: string) {
    return this.habitModel
      .find({ author: new Types.ObjectId(authorId) })
      .sort({ order: 1 })
      .exec();
  }

  async findOne(id: string) {
    return this.habitModel.findById(id).exec();
  }

  async update(id: string, updateHabitDto: UpdateHabitDto) {
    return this.habitModel
      .findByIdAndUpdate(id, updateHabitDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    // First delete associated habit logs
    await this.habitLogModel
      .deleteMany({
        habitId: new Types.ObjectId(id),
      })
      .exec();

    // Then delete the habit
    const result = await this.habitModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async reorderHabits(habitIds: string[]) {
    try {
      const bulkOps = habitIds.map((id, index) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(id) },
          update: { $set: { order: index } },
        },
      }));

      await this.habitModel.bulkWrite(bulkOps);
      return true;
    } catch (error) {
      console.error('Error reordering habits:', error);
      return false;
    }
  }
}
