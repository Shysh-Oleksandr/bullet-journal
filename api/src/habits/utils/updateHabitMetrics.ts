import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getDate,
  getDay,
  getMonth,
  getWeek,
  getYear,
  isSameDay,
  startOfDay,
  startOfToday,
  addDays,
  differenceInDays,
  isToday,
  isWithinInterval,
} from 'date-fns';
import { Model, Types } from 'mongoose';
import { Habit, HabitStreak } from '../habit.model';
import { HabitLog } from '../habit-log.model';
import { HabitPeriod } from '../habit.model';

// Types
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

type HabitStreakType = {
  startDate: Date;
  endDate: Date;
  lastOptionalLogDate: Date;
  numberOfLogs: number;
};

// Constants
const YESTERDAY = addDays(startOfDay(new Date()), -1);

// Helper to get days by habit period
const getDaysByHabitPeriod = (period: HabitPeriod): number => {
  return period === HabitPeriod.WEEK ? 7 : 30;
};

// Helper to get the key for grouping by period (week or month)
const getPeriodKeyByDate = (date: number, period: HabitPeriod) => {
  if (period === HabitPeriod.WEEK) {
    const week = getWeek(date, { weekStartsOn: 1 });
    return `${getYear(date)}-W${week}`;
  }
  return `${getYear(date)}-${getMonth(date) + 1}`;
};

// Helper to group logs by week or month
function groupLogsByPeriod(
  logs: ProcessedHabitLog[],
  period: HabitPeriod,
): Record<string, ProcessedHabitLog[]> {
  const groupedLogs: Record<string, ProcessedHabitLog[]> = {};

  logs.forEach((log) => {
    const key = getPeriodKeyByDate(log.date, period);
    groupedLogs[key] = groupedLogs[key] || [];
    groupedLogs[key].push(log);
  });

  return groupedLogs;
}

// Helper to fill in missing days between the start and end dates
function fillMissingDays(
  habitLogs: ProcessedHabitLog[],
  oldestLogDate: number,
  endDate: number,
): ProcessedHabitLog[] {
  const days = eachDayOfInterval({
    start: startOfDay(oldestLogDate),
    end: startOfDay(endDate),
  });

  return days.map((day) => {
    const log = habitLogs.find((l) => isSameDay(l.date, day));

    return (
      log || {
        date: day.getTime(),
        percentageCompleted: 0,
        amount: 0,
        isArtificial: true,
        _id: '',
        habitId: '',
      }
    );
  });
}

// Helper the target days for first habit period(e.g. if a habit starts in the middle of a period)
function getAdjustedDays(
  periodStartDate: number,
  days: number,
  period: HabitPeriod,
) {
  const periodLength = getDaysByHabitPeriod(period);
  const remainingPeriodDays =
    periodLength -
    (period === HabitPeriod.WEEK
      ? getDay(periodStartDate)
      : getDate(periodStartDate));

  return Math.ceil((days * remainingPeriodDays) / periodLength); // Scale frequency proportionally
}

export const calculateHabitLogsStatus = (habit: {
  _id: string;
  frequency: { days: number; period: HabitPeriod };
  logs?: ProcessedHabitLog[];
}): { oldestLogDate: number; processedLogs: ProcessedHabitLog[] } => {
  const { logs: habitLogs = [], frequency } = habit;
  const { days, period } = frequency;

  const filteredHabitLogs = habitLogs.filter(
    (log) =>
      (log.amount && log.amount > 0 && !log.isArtificial) ||
      log.note ||
      log.isManuallyOptional,
  );

  if (!filteredHabitLogs.length) {
    const today = startOfToday().getTime();

    return {
      oldestLogDate: today,
      processedLogs: [],
    };
  }

  const periodLength = getDaysByHabitPeriod(period);

  const today = startOfToday().getTime();

  // Determine the start date based on the oldest log
  const habitLogsDates = filteredHabitLogs.map((log) => log.date);
  const oldestLogDate = Math.min(...habitLogsDates);

  // Fill missing days
  const endDate = today;
  const logs = fillMissingDays(filteredHabitLogs, oldestLogDate, endDate);

  if (days === periodLength) {
    return {
      oldestLogDate,
      processedLogs: logs.map((log) => ({
        ...log,
        isOptional: log.isManuallyOptional,
      })),
    };
  }

  // Group logs by the desired period (week or month)
  const periodLogs = groupLogsByPeriod(logs, period);

  const processedLogs: ProcessedHabitLog[] = [];

  Object.values(periodLogs).forEach((logsInPeriod) => {
    const isCurrentPeriod =
      logsInPeriod[logsInPeriod.length - 1].date === today;

    const relevantLogsInPeriod = (
      isCurrentPeriod
        ? fillMissingDays(
            logsInPeriod,
            logsInPeriod[0].date,
            period === HabitPeriod.MONTH
              ? endOfMonth(logsInPeriod[0].date).getTime()
              : endOfWeek(logsInPeriod[0].date, { weekStartsOn: 1 }).getTime(),
          )
        : logsInPeriod
    ).map((log) => ({
      ...log,
      isOptional: log.isManuallyOptional,
    }));

    // Calculate the number of times the habit has been logged for this period
    const completedCount = relevantLogsInPeriod.filter(
      (l) => l.percentageCompleted >= 100,
    ).length;

    if (completedCount === 0) {
      processedLogs.push(...relevantLogsInPeriod);
      return;
    }

    const shouldAdjustDays = relevantLogsInPeriod[0].date === oldestLogDate;
    const adjustedDaysToComplete = shouldAdjustDays
      ? getAdjustedDays(relevantLogsInPeriod[0].date, days, period)
      : days;

    const periodLength = relevantLogsInPeriod.length;
    const spacing = Math.round(periodLength / adjustedDaysToComplete);

    if (completedCount >= adjustedDaysToComplete) {
      processedLogs.push(
        ...relevantLogsInPeriod.map((l) => ({
          ...l,
          isOptional: l.percentageCompleted < 100 || l.isManuallyOptional,
        })),
      );
      return;
    }

    let remainingLogs = adjustedDaysToComplete - completedCount;
    let lastCompletedLogIndex = 0;

    relevantLogsInPeriod.forEach((log, index) => {
      if (log.percentageCompleted >= 100) {
        lastCompletedLogIndex = index;
        processedLogs.push(log); // Completed logs are always necessary
        return;
      }

      // Determine if the current day is necessary based on spacing
      const isNecessaryDay =
        remainingLogs > 0 &&
        (index + 1) %
          Math.min(lastCompletedLogIndex + spacing + 1, periodLength - 1) ===
          0;

      if (isNecessaryDay || log.isManuallyOptional) {
        lastCompletedLogIndex = index;
        remainingLogs--;
      }

      processedLogs.push({
        ...log,
        isOptional: !isNecessaryDay || log.isManuallyOptional,
      });
    });

    // Ensure today's log is marked as necessary
    const todayLog = processedLogs.find((log) => log.date === today);

    if (
      isCurrentPeriod &&
      todayLog &&
      todayLog.isOptional &&
      !todayLog.isManuallyOptional
    ) {
      todayLog.isOptional = false; // Override to make it necessary

      // Adjust to keep the number of necessary days equal to `adjustedDaysToComplete`
      const necessaryLogs = processedLogs.filter(
        (log) =>
          relevantLogsInPeriod.some((r) => r.date === log.date) &&
          !log.isOptional,
      );

      if (necessaryLogs.length > adjustedDaysToComplete) {
        // Find the first necessary incomplete log and make it optional
        const logToMakeOptional = necessaryLogs.find(
          (log) => log.date !== today && log.percentageCompleted < 100,
        );

        if (logToMakeOptional) {
          logToMakeOptional.isOptional = true;
        }
      }
    }
  });

  return {
    oldestLogDate,
    processedLogs,
  };
};

export function getHabitStreakInfo(
  habitLogs: ProcessedHabitLog[],
  bestStreaksData: HabitStreakType[],
) {
  if (bestStreaksData.length === 0)
    return { currentStreak: 0, longestStreak: 0, overallCompleted: 0 };

  const isTodayCompleted = habitLogs.some(
    (log) => isToday(log.date) && log.percentageCompleted >= 100,
  );
  const currentStreak =
    bestStreaksData.find((streak) =>
      isWithinInterval(YESTERDAY, {
        start: streak.startDate,
        end: streak.lastOptionalLogDate,
      }),
    )?.numberOfLogs ?? (isTodayCompleted ? 1 : 0);

  const longestStreak = Math.max(
    ...bestStreaksData.map((streak) => streak.numberOfLogs),
  );

  const overallCompleted = habitLogs.filter(
    (log) => log.percentageCompleted >= 100,
  ).length;

  return { currentStreak, longestStreak, overallCompleted };
}

export const calculateHabitBestStreaks = (
  habitLogs: ProcessedHabitLog[],
): HabitStreakType[] => {
  // Sort logs by date in ascending order(oldest to newest)
  const sortedHabitLogs = [...habitLogs].sort((a, b) => a.date - b.date);

  const streaks: HabitStreakType[] = [];
  let currentStreak: HabitStreakType | null = null;

  for (let i = 0; i < sortedHabitLogs.length; i++) {
    const log = sortedHabitLogs[i];
    const prevLog = sortedHabitLogs[i - 1];
    const currentDate = startOfDay(new Date(log.date));

    const isCompleted = log.percentageCompleted >= 100;

    // Check if the current log is completed or optional
    if (isCompleted || (log.isOptional && currentStreak)) {
      if (
        currentStreak &&
        prevLog &&
        differenceInDays(currentDate, startOfDay(new Date(prevLog.date))) <= 1
      ) {
        currentStreak.lastOptionalLogDate = currentDate;
        // Continue the streak
        if (isCompleted) {
          currentStreak.numberOfLogs++; // Only count completed days
          currentStreak.endDate = currentDate;
        }
      } else {
        // Start a new streak
        currentStreak = {
          startDate: currentDate,
          endDate: currentDate,
          lastOptionalLogDate: currentDate,
          numberOfLogs: isCompleted ? 1 : 0,
        };
      }
    } else if (currentStreak) {
      // End the streak if the current log is not completed or optional
      streaks.push(currentStreak);
      currentStreak = null;
    }
  }

  // Add the last streak if any
  if (currentStreak) {
    streaks.push(currentStreak);
  }

  return streaks;
};

// TODO: avoid updating metrics if only note was updated
export async function updateHabitMetrics(
  habitId: string,
  habitModel: Model<Habit>,
  habitLogModel: Model<HabitLog>,
) {
  console.log('Updating habit metrics');
  // Get habit and its logs
  const habit = await habitModel.findById(habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }

  // Get all logs for this habit
  const logs = await habitLogModel
    .find({
      habitId: new Types.ObjectId(habitId),
    })
    .sort({ date: 1 })
    .exec();

  if (logs.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      oldestLogDate: null,
      bestStreaks: [],
      overallCompletions: 0,
      firstCompletedLogDate: null,
    };
  }

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

  // Calculate first completed log date
  const completedLogs = processedLogs.filter(
    (log) => log.percentageCompleted >= 100,
  );
  const firstCompletedLogDate =
    completedLogs.length > 0
      ? new Date(Math.min(...completedLogs.map((log) => log.date)))
      : null;

  // Process habit with logs
  const habitWithLogs = {
    _id: habit._id?.toString() || '',
    frequency: {
      days: habit.frequency.days,
      period: habit.frequency.period,
    },
    logs: processedLogs,
  };

  // Calculate logs status
  const { oldestLogDate, processedLogs: logsWithStatus } =
    calculateHabitLogsStatus(habitWithLogs);

  // Calculate best streaks
  const bestStreaks = calculateHabitBestStreaks(logsWithStatus);

  // Get streak info
  const { currentStreak, longestStreak, overallCompleted } = getHabitStreakInfo(
    logsWithStatus,
    bestStreaks,
  );

  const formattedStreaks: HabitStreak[] = bestStreaks
    .map((streak) => ({
      startDate: streak.startDate,
      endDate: streak.endDate,
      numberOfLogs: streak.numberOfLogs,
    }))
    .sort((a, b) => {
      if (b.numberOfLogs === a.numberOfLogs) {
        return b.startDate.getTime() - a.startDate.getTime();
      }
      return b.numberOfLogs - a.numberOfLogs;
    })
    .slice(0, 6);

  // Update habit with new metrics
  await habitModel.findByIdAndUpdate(habitId, {
    $set: {
      'cachedMetrics.currentStreak': currentStreak,
      'cachedMetrics.longestStreak': longestStreak,
      'cachedMetrics.oldestLogDate': oldestLogDate,
      'cachedMetrics.bestStreaks': formattedStreaks,
      'cachedMetrics.overallCompletions': overallCompleted,
      'cachedMetrics.firstCompletedLogDate':
        firstCompletedLogDate?.getTime() || null,
    },
  });

  return {
    currentStreak,
    longestStreak,
    oldestLogDate: new Date(oldestLogDate),
    bestStreaks: formattedStreaks,
    overallCompletions: overallCompleted,
    firstCompletedLogDate,
  };
}
