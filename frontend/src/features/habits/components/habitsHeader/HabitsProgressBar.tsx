import React, { useMemo } from "react";

import ProgressBar from "../../../../components/ProgressBar";
import { Habit } from "../../types";
import { calculateHabitsPercentageCompletedByDay } from "../../utils/calculateHabitsPercentageCompletedByDay";

type Props = {
  mandatoryHabits: Habit[];
  selectedDate: number;
};

const HabitsProgressBar = ({
  mandatoryHabits,
  selectedDate,
}: Props): JSX.Element => {
  const percentageCompleted = useMemo(
    () =>
      calculateHabitsPercentageCompletedByDay(mandatoryHabits, selectedDate),
    [mandatoryHabits, selectedDate],
  );

  return (
    <ProgressBar
      percentageCompleted={percentageCompleted ?? 0}
    />
  );
};

export default React.memo(HabitsProgressBar);
