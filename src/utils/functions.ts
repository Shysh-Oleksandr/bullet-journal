export function formatTime(time: number) {
  return time < 10 ? `0${time}` : time;
}
