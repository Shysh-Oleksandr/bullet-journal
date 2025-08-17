import { useMemo } from "react";

import { getDifferentColor, isLightColor } from "../../../utils/getDifferentColor";
import theme from "../../../theme";

export const useHabitStatColors = (color = theme.colors.cyan600) =>
  useMemo(() => {
    const isColorLight = isLightColor(color);

    return {
      textColor: isColorLight
        ? getDifferentColor(color, 30)
        : getDifferentColor(color, -15),
      bgColor: isColorLight
        ? getDifferentColor(color, 4)
        : getDifferentColor(color, 20),
      optionalBgColor: isColorLight
        ? getDifferentColor(color, -5)
        : getDifferentColor(color, 35),
      activeBgColor: isColorLight
        ? getDifferentColor(color, 15)
        : getDifferentColor(color, 0),
      secondaryTextColor: getDifferentColor(color, 15),
      isColorLight,
    };
  }, [color]);
