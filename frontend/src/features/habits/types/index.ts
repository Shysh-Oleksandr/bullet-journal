export type HabitLog = {
  _id: string;
  date: number;
  percentageCompleted: number;
  amount?: number;
  amountTarget?: number;
  note?: string;
  isManuallyOptional?: boolean;
  habitId: string;
};

export type CreateHabitLogRequest = Omit<HabitLog, "_id">;

export type Habit = {
  _id: string;
  label: string;
  description?: string;
  amountTarget?: number | null;
  units?: string;
  streakTarget: number;
  overallTarget: number;
  frequency: HabitFrequency;
  habitType: HabitTypes;
  color: string;
  isArchived?: boolean;
  order?: number;
  featuredLogs: HabitLog[]; // Logs for the selected date range
  cachedMetrics: HabitMetrics;
};

export type HabitCalendarDataItem = {
  date: string;
  isOptional: boolean;
  streakState: {
    displayRightLine: boolean;
    displayLeftLine: boolean;
  };
  percentageCompleted: number;
  amount?: number;
  note?: string;
  isManuallyOptional?: boolean;
};

export type HabitMetrics = {
  currentStreak: number;
  longestStreak: number;
  overallCompletions: number;
  oldestLogDate: number;
  firstCompletedLogDate: number;
  bestStreaks?: HabitStreak[];
  calendarData?: Record<string, HabitCalendarDataItem>;
};

export type HabitFrequency = {
  days: number;
  period: HabitPeriods;
};

export enum HabitPeriods {
  WEEK = "week",
  MONTH = "month",
}

export enum HabitTypes {
  CHECK = "CHECK",
  AMOUNT = "AMOUNT",
  TIME = "TIME",
}

export type HabitStreak = {
  startDate: string;
  endDate: string;
  numberOfLogs: number;
  _id: string;
};

export type UpdateHabitRequest = Partial<Habit> &
  Pick<Habit, "_id"> & {
    withDeepClone?: boolean;
  };

export type CreateHabitResponse = {
  habit: Habit;
};

export type CreateHabitRequest = Omit<
  Habit,
  "_id" | "featuredLogs" | "cachedMetrics"
>;

export type DeleteHabitRequest = {
  _id: string;
};

export type ReorderHabitsRequest = {
  habitIds: string[];
};

export enum HabitActions {
  ARCHIVE = "archive",
  UNARCHIVE = "unarchive",
  DELETE = "delete",
  RESTORE = "restore",
}

export type BulkEditHabit = {
  _id: string;
  label: string;
  action: HabitActions;
  isSelected: boolean;
};
