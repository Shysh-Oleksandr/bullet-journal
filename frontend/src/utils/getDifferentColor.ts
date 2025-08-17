import tinycolor from "tinycolor2";

function shadeColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
}

export const isLightColor = (color: string) => {
  const tinyColor = tinycolor(color);

  return tinyColor.isLight();
};

export const getShadedColor = (color: string, amount: number = 20) => {
  const tinyColor = tinycolor(color);

  return tinyColor.isLight()
    ? shadeColor(color, amount * -1)
    : shadeColor(color, amount);
};

export const getDifferentColor = (
  color: string,
  amount: number = 25,
  shouldReverse = false,
) => {
  const tinyColor = tinycolor(color);

  let differentColor = tinyColor;

  if (tinyColor.isLight()) {
    differentColor = shouldReverse
      ? tinyColor.brighten(amount)
      : tinyColor.darken(amount);
  } else {
    differentColor = shouldReverse
      ? tinyColor.darken(amount)
      : tinyColor.brighten(amount);
  }

  return differentColor.toString("hex");
};
