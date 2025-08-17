import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export const getWeekDatesByDate = (date: number): number[] => {
  const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(date, { weekStartsOn: 1 });

  const datesOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  return datesOfWeek.map((date) => date.getTime());
};
