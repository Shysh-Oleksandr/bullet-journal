/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO,
  isAfter,
  isSameDay,
} from 'date-fns';
import { Model, Types } from 'mongoose';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { HabitLog } from './habit-log.model';
import { Habit } from './habit.model';
import { updateHabitMetrics } from './utils/updateHabitMetrics';
import {
  generateCalendarData,
  generateAndCacheCalendarData,
} from './utils/generateCalendarData';
import { CalendarDataItemDto } from './dto/habit-calendar.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    @InjectModel(HabitLog.name) private habitLogModel: Model<HabitLog>,
  ) {}

  async create(createHabitDto: CreateHabitDto, authorId: string) {
    const count = await this.habitModel.countDocuments({
      author: new Types.ObjectId(authorId),
    });

    console.log('createHabitDto', createHabitDto);
    console.log('count', count);

    const newHabit = new this.habitModel({
      ...createHabitDto,
      author: new Types.ObjectId(authorId),
      order: count,
    });
    return newHabit.save();
  }

  async findAllWithLogs(authorId: string) {
    const habits = await this.habitModel
      .find({ author: new Types.ObjectId(authorId) })
      .sort({ order: 1 })
      .exec();

    for (const habit of habits) {
      // Get logs for this habit
      const habitLogs = await this.habitLogModel
        .find({ habitId: habit._id })
        .exec();

      // Create a new object with logs but without oldLogs
      const result = { ...habit.toObject(), logs: habitLogs };

      // @ts-expect-error - We know this property exists in the object
      delete result.oldLogs;

      // Filter out specific cachedMetrics fields
      this.filterCachedMetrics(result);

      // Override the habit with the modified version
      Object.assign(habit, result);
    }
    return habits;
  }

  async findAllArchived(authorId: string) {
    const habits = await this.habitModel
      .find({ author: new Types.ObjectId(authorId), isArchived: true })
      .sort({ order: 1 })
      .exec();

    // Remove logs, oldLogs, and specific cachedMetrics fields from each habit in the response
    return habits.map((habit) => {
      const result = { ...habit.toObject() };

      // @ts-expect-error - We know these properties exist in the object
      delete result.logs;
      // @ts-expect-error - We know these properties exist in the object
      delete result.oldLogs;

      // Filter out specific cachedMetrics fields
      this.filterCachedMetrics(result);

      return result;
    });
  }

  async findAll(authorId: string) {
    const habits = await this.habitModel
      .find({ author: new Types.ObjectId(authorId) })
      .sort({ order: 1 })
      .exec();

    // Remove logs, oldLogs, and specific cachedMetrics fields from each habit in the response
    return habits.map((habit) => {
      const result = { ...habit.toObject() };

      // @ts-expect-error - We know these properties exist in the object
      delete result.logs;
      // @ts-expect-error - We know these properties exist in the object
      delete result.oldLogs;

      // Filter out specific cachedMetrics fields
      this.filterCachedMetrics(result);

      return result;
    });
  }

  async findOne(id: string) {
    const habit = await this.habitModel.findById(id).exec();
    if (habit) {
      const result = { ...habit.toObject() };

      // @ts-expect-error - We know these properties exist in the object
      delete result.logs;
      // @ts-expect-error - We know these properties exist in the object
      delete result.oldLogs;

      // Remove calendarData from cachedMetrics
      const { calendarData: _calendarData, ...restMetrics } =
        result.cachedMetrics;
      result.cachedMetrics = restMetrics;

      return result;
    }
    return habit;
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

  async findAllSummary(
    authorId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Habit[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    const habits = await this.habitModel
      .find({
        author: new Types.ObjectId(authorId),
        isArchived: false,
      })
      .sort({ order: 1 })
      .exec();

    // Convert date strings to timestamps
    const startTimestamp = startOfDay(new Date(startDate)).getTime();
    const endTimestamp = endOfDay(new Date(endDate)).getTime();

    const habitsWithLogs = await Promise.all(
      habits.map(async (habit) => {
        const logs = await this.habitLogModel
          .find({
            habitId: habit._id,
            date: {
              $gte: startTimestamp,
              $lte: endTimestamp,
            },
          })
          .exec();

        // Convert to a plain object
        const habitObj = habit.toObject();

        // Create a new object without logs and oldLogs fields, but with featuredLogs
        const result = { ...habitObj, featuredLogs: logs || [] };

        // Remove the fields we don't want to return
        // Using delete is fine here as this is a plain JavaScript object, not a TypeScript type
        // @ts-expect-error - We know these properties exist in the object
        delete result.logs;
        // @ts-expect-error - We know these properties exist in the object
        delete result.oldLogs;

        // Filter out specific cachedMetrics fields
        this.filterCachedMetrics(result);

        return result;
      }),
    );

    return habitsWithLogs as unknown as Habit[];
  }

  async updateMetricsForAllHabits() {
    const habits = await this.habitModel.find().exec();
    for (const habit of habits) {
      console.log('Updating metrics for habit:', habit._id);
      if (!habit._id) {
        console.log('Habit has no _id');
        continue;
      }
      await updateHabitMetrics(
        habit._id.toString(),
        this.habitModel,
        this.habitLogModel,
      );
    }
  }

  async updateHabitLog(
    habitId: string,
    date: string,
    logData: Partial<HabitLog>,
  ) {
    const habit = await this.habitModel.findById(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Convert date to start of day timestamp
    const startOfDate = startOfDay(new Date(date)).getTime();
    const endOfDate = endOfDay(new Date(date)).getTime();

    // Update or create the log
    const log = await this.habitLogModel.findOneAndUpdate(
      {
        habitId,
        date: {
          $gte: startOfDate,
          $lte: endOfDate,
        },
      },
      { ...logData, habitId, date: startOfDate, note: logData.note || '' },
      { upsert: true, new: true },
    );

    // Update habit metrics
    const updatedMetrics = await updateHabitMetrics(
      habitId,
      this.habitModel,
      this.habitLogModel,
    );

    // If we updated a log within the last two months, also update the calendar data cache
    const today = new Date();
    const twoMonthsAgo = startOfMonth(subMonths(today, 1));
    const logDate = new Date(startOfDate);

    if (isAfter(logDate, twoMonthsAgo) || isSameDay(logDate, twoMonthsAgo)) {
      // For caching, generate data for current month and previous month
      const cacheStartDate = twoMonthsAgo;
      const cacheEndDate = endOfMonth(today);

      await generateAndCacheCalendarData(
        habitId,
        this.habitModel,
        this.habitLogModel,
        updatedMetrics.bestStreaks,
        cacheStartDate,
        cacheEndDate,
      );
    } else {
      console.log('Not updating calendar data');
    }

    return log;
  }

  async deleteHabitLog(habitId: string, date: string) {
    // Convert date to start of day timestamp
    const startOfDate = startOfDay(new Date(date)).getTime();
    const endOfDate = endOfDay(new Date(date)).getTime();

    const result = await this.habitLogModel.deleteOne({
      habitId,
      date: {
        $gte: startOfDate,
        $lte: endOfDate,
      },
    });

    if (result.deletedCount > 0) {
      // Update habit metrics after successful deletion
      const updatedMetrics = await updateHabitMetrics(
        habitId,
        this.habitModel,
        this.habitLogModel,
      );

      // If we deleted a log within the last two months, also update the calendar data cache
      const today = new Date();
      const twoMonthsAgo = startOfMonth(subMonths(today, 1));
      const logDate = new Date(startOfDate);

      if (isAfter(logDate, twoMonthsAgo) || isSameDay(logDate, twoMonthsAgo)) {
        // For caching, generate data for current month and previous month
        const cacheStartDate = twoMonthsAgo;
        const cacheEndDate = endOfMonth(today);

        await generateAndCacheCalendarData(
          habitId,
          this.habitModel,
          this.habitLogModel,
          updatedMetrics.bestStreaks,
          cacheStartDate,
          cacheEndDate,
        );
      }
    }

    return result.deletedCount > 0;
  }

  async getHabitCalendarData(
    habitId: string,
    queryParams: { startDate?: string; endDate?: string; month?: string },
  ): Promise<Record<string, CalendarDataItemDto>> {
    const habit = await this.habitModel.findById(habitId).exec();
    if (!habit) {
      throw new BadRequestException('Habit not found');
    }

    let startDate: Date;
    let endDate: Date;

    // Determine date range based on query params
    if (queryParams.month) {
      // If month is provided, use that month
      const monthDate = parseISO(queryParams.month + '-01');
      startDate = startOfMonth(monthDate);
      endDate = endOfMonth(monthDate);
    } else if (queryParams.startDate && queryParams.endDate) {
      // If start and end dates are provided, use them
      startDate = startOfDay(parseISO(queryParams.startDate));
      endDate = endOfDay(parseISO(queryParams.endDate));
    } else {
      // Default to current month and previous month
      const today = new Date();
      startDate = startOfMonth(subMonths(today, 1));
      endDate = endOfMonth(today);
    }

    // Check if we should generate and cache the data
    const today = new Date();
    const isRequestingRecentData = isAfter(
      startDate,
      endOfMonth(subMonths(today, 2)),
    );
    const shouldCacheData = isRequestingRecentData;

    // Check if we have cached data that's still valid
    const cachedData = habit.cachedMetrics?.calendarData || {};
    const lastCalendarUpdate = habit.cachedMetrics?.lastCalendarDataUpdate;

    if (
      shouldCacheData &&
      lastCalendarUpdate &&
      isAfter(new Date(lastCalendarUpdate), startOfDay(subMonths(today, 2)))
    ) {
      // Use cached data if available and fresh
      return this.filterCalendarDataByDateRange(cachedData, startDate, endDate);
    }

    // Otherwise, generate new data
    if (shouldCacheData) {
      // For caching, generate data for current month and previous month
      const cacheStartDate = startOfMonth(subMonths(today, 1));
      const cacheEndDate = endOfMonth(today);

      const calendarData = await generateAndCacheCalendarData(
        habitId,
        this.habitModel,
        this.habitLogModel,
        habit.cachedMetrics?.bestStreaks || [],
        cacheStartDate,
        cacheEndDate,
      );

      return this.filterCalendarDataByDateRange(
        calendarData,
        startDate,
        endDate,
      );
    } else {
      // Get all logs for this habit
      const logs = await this.habitLogModel
        .find({
          habitId: new Types.ObjectId(habitId),
        })
        .sort({ date: 1 })
        .exec();

      // Convert logs to the format expected by our calculation functions
      const processedLogs = logs.map((log) => ({
        _id: log._id?.toString() || '',
        habitId: log.habitId?.toString() || '',
        date: log.date,
        percentageCompleted: log.percentageCompleted,
        amount: log.amount || 0,
        note: log.note,
        isManuallyOptional: log.isManuallyOptional,
      }));

      // Process habit with logs
      const habitWithLogs = {
        _id: habit._id?.toString() || '',
        frequency: {
          days: habit.frequency.days,
          period: habit.frequency.period,
        },
        logs: processedLogs,
      };

      // Generate calendar data
      return generateCalendarData(
        habitWithLogs,
        habit.cachedMetrics?.bestStreaks || [],
        startDate,
        endDate,
      );
    }
  }

  private filterCalendarDataByDateRange(
    calendarData: Record<string, any>,
    startDate: Date,
    endDate: Date,
  ): Record<string, CalendarDataItemDto> {
    const result: Record<string, CalendarDataItemDto> = {};

    // Convert dates to YYYY-MM-DD format for comparison
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Filter calendar data by date range
    Object.entries(calendarData).forEach(([date, data]) => {
      if (date >= startDateStr && date <= endDateStr) {
        result[date] = data as CalendarDataItemDto;
      }
    });

    return result;
  }

  // Helper method to filter out specific cachedMetrics fields
  private filterCachedMetrics(
    habitObj: Record<string, any>,
  ): Record<string, any> {
    if (habitObj.cachedMetrics) {
      const {
        bestStreaks: _bestStreaks,
        calendarData: _calendarData,
        lastCalendarDataUpdate: _lastCalendarDataUpdate,
        ...restMetrics
      } = habitObj.cachedMetrics;
      habitObj.cachedMetrics = restMetrics;
    }
    return habitObj;
  }
}
