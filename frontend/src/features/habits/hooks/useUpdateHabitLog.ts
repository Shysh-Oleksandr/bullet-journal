import { isSameDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { habitsApi } from "../api/habitsApi";
import { Habit, HabitLog, HabitTypes } from "../types";

type Props = {
  habit: Habit;
  selectedDate: number;
  currentLog?: HabitLog;
};

export const useUpdateHabitLog = ({
  habit,
  selectedDate,
  currentLog,
}: Props) => {
  const { mutate: createOrUpdateHabitLog } =
    habitsApi.useCreateOrUpdateHabitLogMutation();

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const relevantLog =
    currentLog ??
    habit.featuredLogs.find((log) => isSameDay(log.date, selectedDate));

  const initialLogValue = relevantLog?.amount?.toString() ?? "0";

  const [inputValue, setInputValue] = useState(initialLogValue);

  const updateLog = useCallback(() => {
    if (relevantLog?._id.includes("temp")) return;

    if (inputValue.trim().length === 0) {
      setInputValue(initialLogValue);

      return;
    }

    const value = +inputValue.replace(",", ".");

    if (isNaN(value)) {
      setInputValue(initialLogValue);

      return;
    }

    const isSameValue = !isCheckHabitType && value === relevantLog?.amount;

    if (isSameValue) return;

    const amountPercentageCompleted = habit.amountTarget
      ? Math.round((value / habit.amountTarget) * 100)
      : 0;

    const checkedPercentageCompleted =
      relevantLog?.percentageCompleted === 100 ? 0 : 100;
    const percentageCompleted = isCheckHabitType
      ? checkedPercentageCompleted
      : amountPercentageCompleted;

    createOrUpdateHabitLog({
      date: selectedDate,
      percentageCompleted,
      amount: isCheckHabitType ? percentageCompleted / 100 : value,
      amountTarget: habit.amountTarget ?? 1,
      habitId: habit._id,
    });
  }, [
    inputValue,
    isCheckHabitType,
    relevantLog,
    habit.amountTarget,
    habit._id,
    initialLogValue,
    createOrUpdateHabitLog,
    selectedDate,
  ]);

  const onChange = useCallback((text: string) => {
    const newValue = Number(text);

    if (newValue < 0) {
      setInputValue("0");

      return;
    }

    setInputValue(text);
  }, []);

  useEffect(() => {
    setInputValue(initialLogValue);
  }, [initialLogValue]);

  return useMemo(
    () => ({ inputValue, updateLog, onChange, currentLog: relevantLog }),
    [relevantLog, inputValue, onChange, updateLog],
  );
};
