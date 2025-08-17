import { isSameDay } from "date-fns";
import React, { useMemo } from "react";

import { getIsActiveOnSelectedDate } from "../../utils/getIsActiveOnSelectedDate";

import { useUpdateHabitLog } from "../../hooks/useUpdateHabitLog";
import { Habit } from "../../types";

import HabitBody from "./HabitBody";

type Props = {
  habit: Habit;
  selectedDate: number;
  onLongPress?: () => void;
};

const HabitItem = ({
  habit,
  selectedDate,
  onLongPress,
}: Props): JSX.Element => {
  const { inputValue, currentLog, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate,
  });

  const isActiveOnSelectedDate = useMemo(
    () =>
      getIsActiveOnSelectedDate(
        selectedDate,
        habit.cachedMetrics.oldestLogDate,
      ),
    [habit.cachedMetrics.oldestLogDate, selectedDate],
  );

  const isCompleted = Boolean(
    habit.featuredLogs.some(
      (log) =>
        isSameDay(log.date, selectedDate) && log.percentageCompleted >= 100,
    ),
  );

  return (
    <HabitBody
      habit={habit}
      inputValue={inputValue}
      isCompleted={isCompleted}
      currentLog={currentLog}
      isActiveOnSelectedDate={isActiveOnSelectedDate}
      onChange={onChange}
      updateLog={updateLog}
      onLongPress={onLongPress}
    />
  );
};

export default React.memo(HabitItem);
