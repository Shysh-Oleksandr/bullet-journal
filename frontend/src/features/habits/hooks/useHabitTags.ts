import { useMemo } from "react";

import { Habit, HabitTypes } from "../types";

import { useHabitFrequencyLabel } from "./useHabitFrequencyLabel";

export const useHabitTags = (habit: Habit, amountTarget?: number) => {

  const frequencyLabel = useHabitFrequencyLabel(habit.frequency);

  const tags = useMemo(() => {
    const tags: string[] = [];

    if (habit.habitType !== HabitTypes.CHECK) {
      tags.push(
        `Target amount ${amountTarget ?? habit.amountTarget} ${
          habit.units
        }`,
      );
    }

    tags.push(
      `Streak: ${habit.cachedMetrics.currentStreak}/${habit.streakTarget} times`,
    );
    tags.push(
      `Longest streak: ${habit.cachedMetrics.longestStreak} times`,
    );
    tags.push(
      `Overall: ${habit.cachedMetrics.overallCompletions}/${habit.overallTarget} times`,
    );

    tags.push(`Frequency: ${frequencyLabel}`);

    return tags;
  }, [habit, frequencyLabel, amountTarget]);

  return tags;
};
