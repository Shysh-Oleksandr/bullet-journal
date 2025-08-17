import { isBefore, startOfDay } from "date-fns";

export function getIsActiveOnSelectedDate(
  date: number,
  oldestLogDate?: number,
) {
  const isActiveOnSelectedDate = Boolean(
    oldestLogDate && !isBefore(startOfDay(date), startOfDay(oldestLogDate)),
  );

  return isActiveOnSelectedDate;
}
