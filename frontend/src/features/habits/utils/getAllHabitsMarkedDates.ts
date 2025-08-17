import { Habit } from "../types";

export const getAllHabitsMarkedDates = (allHabits: Habit[]) => {
  if (allHabits.length === 0) return {};

  // Create a map to store logs grouped by date
  const logsByDate: Record<string, number> = {};
  const habitsByStartDate: Record<string, number> = {};

  allHabits.forEach((habit) => {
    // Determine the start date of the habit based on its logs
    const habitStartDate = habit.cachedMetrics.oldestLogDate;

    // Store the start date for each habit
    if (habitStartDate) {
      habitsByStartDate[habit._id] = habitStartDate;
    }

    // habit.logs.forEach((log) => {
    //   // Ignore logs before the habit's start date
    //   if (habitStartDate && log.date < habitStartDate) {
    //     return;
    //   }

    //   const formattedDate = format(log.date, SIMPLE_DATE_FORMAT);

    //   // Initialize the date entry if it doesn't exist
    //   if (!logsByDate[formattedDate]) {
    //     logsByDate[formattedDate] = 0;
    //   }

    //   // Increment completed count if the log is marked as completed
    //   if (log.percentageCompleted >= 100) {
    //     logsByDate[formattedDate] += 1;
    //   }
    // });
  });

  // Convert the aggregated data into the desired format
  return Object.entries(logsByDate).reduce(
    (acc, [date]) => {
      // const mandatoryHabitsCount = allHabits.filter((habit) => {
      //   const log = habit.logs.find((log) =>
      //     isSameDay(log.date, new Date(date)),
      //   );

      //   return (
      //     log &&
      //     !log.isManuallyOptional &&
      //     log.date >= habitsByStartDate[habit._id]
      //   );
      // }).length;

      acc[date] = {
        percentageCompleted: 0,
        marked: true,
      };

      return acc;
    },
    {} as {
      [key: string]: {
        percentageCompleted: number;
        marked: boolean;
      };
    },
  );
};
