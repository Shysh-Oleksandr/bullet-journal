
import theme from "../../../theme";
import { Habit, HabitPeriods, HabitTypes } from "../types";
import { getWeekDatesByDate } from "../utils/getWeekDatesByDate";

const FIXED_DATE = new Date("2024-01-01").getTime();

export const WEEKDAYS_DATES = getWeekDatesByDate(FIXED_DATE);

// TODO: refactor to get rid of it
export const EMPTY_HABIT: Habit = {
  _id: "",
  label: "",
  color: theme.colors.cyan600,
  habitType: HabitTypes.CHECK,
  streakTarget: 30,
  overallTarget: 100,
  frequency: {
    days: 7,
    period: HabitPeriods.WEEK,
  },
  featuredLogs: [],
  cachedMetrics: {
    bestStreaks: [],
    firstCompletedLogDate: 0,
    currentStreak: 0,
    longestStreak: 0,
    overallCompletions: 0,
    oldestLogDate: 0,
  },
};

export const EXTREME_PAST_DATE = new Date("2024-01-01");
