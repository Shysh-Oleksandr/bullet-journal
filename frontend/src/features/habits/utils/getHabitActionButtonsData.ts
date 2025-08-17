
import theme from "../../../theme";
import { BulkEditHabit, HabitActions } from "../types";

export const getHabitActionButtonsData = (currentHabits: BulkEditHabit[]) => {
  const selectedHabits = currentHabits.filter((habit) => habit.isSelected);
  const areHabitsSelected = selectedHabits.length > 0;
  const canArchive = selectedHabits.every(
    (habit) => habit.action !== HabitActions.ARCHIVE,
  );
  const canUnarchive = selectedHabits.every(
    (habit) => habit.action === HabitActions.ARCHIVE,
  );

  const canDelete = selectedHabits.every(
    (habit) => habit.action !== HabitActions.DELETE,
  );
  const canRestore =
    areHabitsSelected &&
    selectedHabits.every((habit) => habit.action === HabitActions.DELETE);

  return [
    {
      label: "Archive",
      disabled: !canArchive,
      action: HabitActions.ARCHIVE,
      bgColor: theme.colors.cyan700,
    },
    {
      label: "Unarchive",
      disabled: !canUnarchive,
      action: HabitActions.UNARCHIVE,
      bgColor: theme.colors.cyan600,
    },
    {
      label: canRestore ? "Restore" : "Delete",
      disabled: !canRestore && !canDelete,
      action: canRestore ? HabitActions.RESTORE : HabitActions.DELETE,
      bgColor: canRestore ? theme.colors.cyan500 : theme.colors.red600,
    },
  ];
};
