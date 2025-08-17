import { useMemo, useState } from "react";

const currentYear = new Date().getUTCFullYear();

export const useHabitsSelectedYear = (oldestHabitLog: number) => {
  const oldestHabitLogYear = oldestHabitLog
    ? new Date(oldestHabitLog).getUTCFullYear()
    : currentYear;

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const isNextYearDisabled = selectedYear === currentYear;
  const isPrevYearDisabled = selectedYear === oldestHabitLogYear;

  const onPrevArrowPress = () => setSelectedYear((prev) => prev - 1);
  const onNextArrowPress = () => setSelectedYear((prev) => prev + 1);

  return useMemo(
    () => ({
      selectedYear,
      isNextYearDisabled,
      isPrevYearDisabled,
      onPrevArrowPress,
      onNextArrowPress,
    }),
    [isNextYearDisabled, isPrevYearDisabled, selectedYear],
  );
};
