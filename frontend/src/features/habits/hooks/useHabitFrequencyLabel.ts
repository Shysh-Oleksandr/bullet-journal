import { useMemo } from "react";

import { HabitFrequency } from "../types";
import { getDaysByHabitPeriod } from "../utils/getDaysByHabitPeriod";

export const useHabitFrequencyLabel = (frequency: HabitFrequency) => {

  const tags = useMemo(() => {
    const isDaily = frequency.days === getDaysByHabitPeriod(frequency.period);

    if (isDaily) {
      return "Daily";
    }

    return `${frequency.days} times/${frequency.period}`;
  }, [frequency.days, frequency.period]);

  return tags;
};
