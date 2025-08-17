import { isSameDay } from "date-fns";

import { Habit } from "../types";

export function calculateHabitsPercentageCompletedByDay(
  habitsAtSelectedDay: Habit[],
  selectedDate: number,
): number | null {
  if (habitsAtSelectedDay.length === 0) return null;

  const completedLogs = habitsAtSelectedDay.filter((habit) =>
    habit.featuredLogs.some(
      (log) =>
        isSameDay(log.date, selectedDate) && log.percentageCompleted >= 100,
    ),
  ).length;

  const percentageCompleted =
    (completedLogs / habitsAtSelectedDay.length) * 100;

  return Math.min(Math.round(percentageCompleted), 100);
}
