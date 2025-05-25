import { addDays } from 'date-fns';

export function eachDayOfInterval({
  start,
  end = new Date(Date.now()),
}: {
  start: Date;
  end?: Date;
}) {
  // Convert to UTC dates
  const startUtc = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
  );
  const endUtc = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()),
  );

  let currentDate = startUtc;
  const days: Date[] = [];

  while (currentDate <= endUtc) {
    days.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return days;
}

export function getDateInUtc(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
