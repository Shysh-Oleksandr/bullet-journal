import { differenceInDays, startOfDay, startOfToday } from "date-fns";
import { useMemo } from "react";

import { HabitPeriods } from "../types";
import { getDaysByHabitPeriod } from "../utils/getDaysByHabitPeriod";

export const useCalculateHabitAverageByPeriod = (
  oldestHabitLog: number,
  completedDays: number,
  habitPeriod: HabitPeriods,
) =>
  useMemo(() => {
    const habitLifeTimeInDays =
      (differenceInDays(startOfToday(), startOfDay(oldestHabitLog)) || 0) + 1;

    const periodDays = getDaysByHabitPeriod(habitPeriod);

    const averageByPeriod = Math.round(
      (completedDays / habitLifeTimeInDays) * periodDays,
    );

    return Math.min(averageByPeriod, periodDays);
  }, [completedDays, habitPeriod, oldestHabitLog]);
