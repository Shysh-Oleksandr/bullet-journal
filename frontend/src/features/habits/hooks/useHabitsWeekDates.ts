import { isSameDay } from "date-fns";
import { useMemo } from "react";

import { Habit } from "../types";
import { getWeekDatesByDate } from "../utils/getWeekDatesByDate";

export const useHabitsWeekDates = (
  selectedDate: number,
  activeHabits: Habit[],
) => {
  return useMemo(() => {
    const weekDates = getWeekDatesByDate(selectedDate);

    return getWeeklyCompletionRates(activeHabits, weekDates);
  }, [activeHabits, selectedDate]);
};

const getWeeklyCompletionRates = (
  activeHabits: Habit[],
  weekDates: number[],
): { date: number; percentageCompleted: number }[] => {
  if (activeHabits.length === 0)
    return weekDates.map((date) => ({ date, percentageCompleted: 0 }));

  const habitsByStartDate: Record<string, number> = {};
  const completionRates: { date: number; percentageCompleted: number }[] = [];

  // Calculate the start date for each habit
  activeHabits.forEach((habit) => {
    const habitStartDate = habit.cachedMetrics.oldestLogDate;

    if (habitStartDate) {
      habitsByStartDate[habit._id] = habitStartDate;
    }
  });

  // Calculate completion rates for each date in the week
  weekDates.forEach((date) => {
    let completedLogs = 0;
    let activeHabitsCount = 0;

    activeHabits.forEach((habit) => {
      const habitStartDate = habitsByStartDate[habit._id];

      // Skip habits that haven't started yet
      if (habitStartDate && date < habitStartDate) return;

      // Check if the habit is active for this date
      activeHabitsCount++;

      // Check if the habit is completed for this date
      const isCompleted = habit.featuredLogs.some(
        (log) => isSameDay(log.date, date) && log.percentageCompleted >= 100,
      );

      if (isCompleted) {
        completedLogs++;
      }
    });

    const percentageCompleted = activeHabitsCount
      ? Math.round((completedLogs / activeHabitsCount) * 100)
      : 0;

    completionRates.push({ date, percentageCompleted });
  });

  return completionRates;
};
