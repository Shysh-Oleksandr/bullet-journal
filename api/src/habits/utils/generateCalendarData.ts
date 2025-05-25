import {
  eachDayOfInterval,
  format,
  startOfDay,
  isSameDay,
  isWithinInterval,
  getDay,
  isFirstDayOfMonth,
} from 'date-fns';
import { HabitPeriod, HabitStreak } from '../habit.model';
import { calculateHabitLogsStatus } from './updateHabitMetrics';

type ProcessedHabitLog = {
  date: number;
  percentageCompleted: number;
  amount: number;
  isArtificial?: boolean;
  isManuallyOptional?: boolean;
  isOptional?: boolean;
  _id: string;
  habitId: string;
  note?: string;
};

type HabitWithLogs = {
  _id: string;
  frequency: {
    days: number;
    period: HabitPeriod;
  };
  logs: ProcessedHabitLog[];
};

interface CalendarDataItem {
  date: string;
  isOptional: boolean;
  streakState: {
    displayRightLine: boolean;
    displayLeftLine: boolean;
  };
  percentageCompleted: number;
  amount?: number;
  note?: string;
  isManuallyOptional: boolean;
}

export function generateCalendarData(
  habit: HabitWithLogs,
  bestStreaks: HabitStreak[],
  startDate: Date,
  endDate: Date,
): Record<string, CalendarDataItem> {
  console.log('Generating calendar data');
  // First, calculate the habit logs status to get isOptional data
  const { processedLogs } = calculateHabitLogsStatus(habit);

  // Format streak intervals for checking streak state
  const streakIntervals = bestStreaks
    .filter((streak) => streak.numberOfLogs > 1)
    .map((streak) => ({
      startDate: startOfDay(new Date(streak.startDate)),
      endDate: startOfDay(new Date(streak.endDate)),
    }));

  // Get all days in the range
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Initialize calendar data
  const calendarData: Record<string, CalendarDataItem> = {};

  // Process each day
  days.forEach((day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');

    // Find the log for this day
    const log = processedLogs.find((l) => isSameDay(new Date(l.date), day));

    if (!log) {
      // If no log for this day, add an empty entry
      calendarData[formattedDate] = {
        date: formattedDate,
        isOptional: false,
        streakState: {
          displayRightLine: false,
          displayLeftLine: false,
        },
        percentageCompleted: 0,
        isManuallyOptional: false,
      };
      return;
    }

    // Calculate streak state
    let isWithinStreak = false;
    let startingDay = false;
    let endingDay = false;

    for (const { startDate, endDate } of streakIntervals) {
      if (isSameDay(day, startDate)) startingDay = true;
      if (isSameDay(day, endDate)) endingDay = true;
      if (
        !isWithinStreak &&
        isWithinInterval(day, { start: startDate, end: endDate })
      ) {
        isWithinStreak = true;
      }
      if (startingDay && endingDay && isWithinStreak) break;
    }

    const isFirstCalendarDay = getDay(day) === 1 || isFirstDayOfMonth(day);

    // Create calendar data item
    calendarData[formattedDate] = {
      date: formattedDate,
      isOptional: log.isOptional || false,
      streakState: {
        displayRightLine: startingDay || (isWithinStreak && !endingDay),
        displayLeftLine: isFirstCalendarDay && isWithinStreak && !startingDay,
      },
      percentageCompleted: log.percentageCompleted,
      amount: log.amount,
      note: log.note,
      isManuallyOptional: log.isManuallyOptional || false,
    };
  });

  return calendarData;
}

export async function generateAndCacheCalendarData(
  habitId: string,
  habitModel: any,
  habitLogModel: any,
  bestStreaks: HabitStreak[],
  startDate: Date,
  endDate: Date,
) {
  console.log('Generating and caching calendar data');
  // Get all logs for this habit
  const logs = await habitLogModel
    .find({
      habitId,
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

  // Get the habit
  const habit = await habitModel.findById(habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }

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
  const calendarData = generateCalendarData(
    habitWithLogs,
    bestStreaks,
    startDate,
    endDate,
  );

  // Update the habit with cached calendar data
  await habitModel.findByIdAndUpdate(habitId, {
    $set: {
      'cachedMetrics.calendarData': calendarData,
      'cachedMetrics.lastCalendarDataUpdate': new Date().getTime(),
    },
  });

  return calendarData;
}
