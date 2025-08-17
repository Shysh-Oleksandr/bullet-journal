import { HabitPeriods } from "../types";

export const getDaysByHabitPeriod = (period: HabitPeriods): number =>
  period === HabitPeriods.WEEK ? 7 : 30;
