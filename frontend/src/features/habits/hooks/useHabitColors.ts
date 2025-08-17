import { useMemo } from "react";

import { getDifferentColor, isLightColor } from "../../../utils/getDifferentColor";
import theme from "../../../theme";

export const useHabitColors = (
  isCompleted: boolean,
  color = theme.colors.cyan600,
) =>
  useMemo(() => {
    const isColorLight = isLightColor(color);

    const gradientColors = isCompleted
      ? isColorLight
        ? ([color, getDifferentColor(color, 25)] as const)
        : ([getDifferentColor(color, 25), color] as const)
      : ([theme.colors.white, theme.colors.cyan300] as const);

    const textColor = isCompleted
      ? getDifferentColor(color, 100)
      : theme.colors.darkBlueText;

    const labelBgColor = isCompleted
      ? getDifferentColor(color, isColorLight ? 8 : 15)
      : theme.colors.cyan500 + "25";

    const checkboxBgColor = isCompleted
      ? getDifferentColor(color, isColorLight ? 2 : 7)
      : "transparent";

    const tintColor = isCompleted ? checkboxBgColor : theme.colors.cyan600;
    const bgTintColor = isCompleted
      ? getDifferentColor(color, isColorLight ? 20 : 35)
      : theme.colors.crystal;

    return {
      textColor,
      gradientColors,
      labelBgColor,
      checkboxBgColor,
      tintColor,
      bgTintColor,
    };
  }, [color, isCompleted]);
