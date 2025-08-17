import React, { useCallback, useRef } from "react";


import { MdMoreHoriz } from "react-icons/md";
import { useHabitColors } from "../../hooks/useHabitColors";
import { useHabitStatColors } from "../../hooks/useHabitStatColors";

import { Habit, HabitLog, HabitTypes } from "../../types";

import ItemCircularProgress from "../../../../components/ItemCircularProgress";
import Typography from "../../../../components/Typography";
import { useAppNavigation } from "../../../../modules/navigation/NavigationService";
import HabitTags from "./HabitTags";

type Props = {
  habit: Habit;
  inputValue: string;
  isCompleted: boolean;
  currentLog?: HabitLog;
  isActiveOnSelectedDate?: boolean;
  updateLog?: () => void;
  onChange?: (text: string) => void;
  onLongPress?: () => void;
};

const HabitBody = ({
  habit,
  inputValue,
  isCompleted,
  currentLog,
  isActiveOnSelectedDate = true,
  updateLog,
  onChange,
  onLongPress,
}: Props): JSX.Element => {
  const navigation = useAppNavigation();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const { textColor, gradientColors, labelBgColor } = useHabitColors(
    isCompleted,
    habit.color,
  );

  const { optionalBgColor } = useHabitStatColors(habit.color);

  const hasAdditionalInfo = currentLog?.isManuallyOptional || currentLog?.note;

  const indicatorBgColor = isCompleted ? optionalBgColor : "#06b6d4";

  const onCardPress = useCallback(() => {
    if (isCheckHabitType) {
      updateLog?.();

      return;
    }

    inputRef.current?.focus();
  }, [isCheckHabitType, updateLog]);

  const onDetailsPress = useCallback(() => {
    // navigation.navigate(Routes.HABIT_STATS, {
    //   id: habit._id,
    //   color: habit.color,
    //   label: habit.label,
    // });
  }, [navigation, habit]);

  return (
    <div
      className="mb-4 rounded-lg bg-white w-full shadow-lg duration-300 cursor-pointer transition-opacity hover:opacity-90 relative"
      onClick={onCardPress}
      onContextMenu={onLongPress}
    >
      <div
        className="w-full rounded-lg p-5 pb-3"
        style={{
          background: `linear-gradient(135deg, ${gradientColors.join(', ')})`
        }}
      >
        {!isActiveOnSelectedDate && (
          <div 
            className="absolute -top-3 left-2 bg-cyan-500 shadow-sm text-white px-2 py-1 rounded-md z-10"
          >
            <Typography fontSize="sm" fontWeight="semibold">
              Not started yet
            </Typography>
          </div>
        )}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center flex-1 relative">
            <ItemCircularProgress
              inputValue={inputValue}
              color={habit.color}
              isCheckType={isCheckHabitType}
              isCompleted={isCompleted}
              percentageCompleted={currentLog?.percentageCompleted}
              handleUpdate={updateLog}
              onChange={onChange}
              inputRef={inputRef}
            />
            {hasAdditionalInfo && (
              <div
                className="absolute w-3 h-3 top-0 left-7 rounded-full z-10 border-3"
                style={{
                  backgroundColor: currentLog?.note ? indicatorBgColor : gradientColors[0],
                  borderColor: indicatorBgColor,
                  borderWidth: '3px'
                }}
              />
            )}
            <div className="flex-1">
              <Typography
                color={textColor}
                paddingLeft={14}
                paddingRight={6}
                fontSize="lg"
                fontWeight="semibold"
                className="line-clamp-2"
              >
                {habit.label}
              </Typography>
            </div>
          </div>
          {/* {!!updateLog && (
            <button
              className="flex items-center justify-center p-2 hover:bg-white/20 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDetailsPress();
              }}
            >
              <MdMoreHoriz
                color={textColor}
                size={20}
              />
            </button>
          )} */}
        </div>
        <HabitTags
          habit={habit}
          amountTarget={currentLog?.amountTarget}
          labelBgColor={labelBgColor}
          textColor={textColor}
        />
      </div>
    </div>
  );
};

export default React.memo(HabitBody);
