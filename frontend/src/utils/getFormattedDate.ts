import { format } from 'date-fns';

export const NOTE_DATE_FORMAT = 'EEE MMM dd yyyy HH:mm';
export const NOTE_TIME_FORMAT = 'HH:mm';

export const getFormattedDate = (date?: number | string | Date): string => {
    const relevantDate = date ? new Date(date) : new Date();

    return format(new Date(relevantDate), NOTE_DATE_FORMAT);
};

export const getTimeByDate = (date?: number | string | Date): string => {
    const relevantDate = date ? new Date(date) : new Date();

    return format(new Date(relevantDate), NOTE_TIME_FORMAT);
};
