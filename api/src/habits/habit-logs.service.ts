import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HabitLog } from './habit-log.model';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';

@Injectable()
export class HabitLogsService {
  constructor(
    @InjectModel(HabitLog.name) private habitLogModel: Model<HabitLog>,
  ) {}

  async create(createHabitLogDto: CreateHabitLogDto) {
    const newHabitLog = new this.habitLogModel(createHabitLogDto);
    return newHabitLog.save();
  }

  async createMany(createHabitLogDtos: CreateHabitLogDto[]) {
    return this.habitLogModel.insertMany(createHabitLogDtos);
  }

  async findAll(habitId: string) {
    return this.habitLogModel
      .find({ habitId: new Types.ObjectId(habitId) })
      .exec();
  }

  async findOne(id: string) {
    return this.habitLogModel.findById(id).exec();
  }

  async update(id: string, updateHabitLogDto: UpdateHabitLogDto) {
    return this.habitLogModel
      .findByIdAndUpdate(id, updateHabitLogDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    const result = await this.habitLogModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async removeAllForHabit(habitId: string) {
    const result = await this.habitLogModel
      .deleteMany({
        habitId: new Types.ObjectId(habitId),
      })
      .exec();
    return result.deletedCount > 0;
  }

  async findByDateRange(habitId: string, startDate: number, endDate: number) {
    return this.habitLogModel
      .find({
        habitId: new Types.ObjectId(habitId),
        date: { $gte: startDate, $lte: endDate },
      })
      .exec();
  }
}
