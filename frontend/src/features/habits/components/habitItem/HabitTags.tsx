import React from "react";

import Typography from "../../../../components/Typography";

import { useHabitTags } from "../../hooks/useHabitTags";
import { Habit } from "../../types";

type Props = {
  habit: Habit;
  amountTarget?: number;
  labelBgColor: string;
  textColor: string;
};

const HabitTags = ({
  habit,
  amountTarget,
  labelBgColor,
  textColor,
}: Props): JSX.Element => {
  const tags = useHabitTags(habit, amountTarget);

  return (
    <div className="flex flex-row flex-wrap items-center gap-1.5 mt-2">
      {tags.map((tag, index) => (
        <div 
          key={index} 
          className="z-20 px-1.5 py-0.5 rounded-md shadow-sm"
          style={{ backgroundColor: labelBgColor }}
        >
          <Typography
            color={textColor}
            fontWeight="semibold"
            align="center"
            fontSize="xs"
          >
            {tag}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default React.memo(HabitTags);
