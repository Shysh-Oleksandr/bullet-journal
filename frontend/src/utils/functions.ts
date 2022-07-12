import DOMPurify from 'dompurify';
import tinycolor from 'tinycolor2';
import IUser from '../interfaces/user';
import INote from '../interfaces/note';
import { COLOR_SEPARATOR, defaultNoteTypes, ICustomNoteLabel, SEPARATOR } from './data';

export function shadeColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, (color) => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export const sanitizedData = (data: string): string => DOMPurify.sanitize(data);

export const getDifferentColor = (color: string, amount: number = 20) => {
    const tinyColor = tinycolor(color);

    return tinyColor.isLight() ? shadeColor(color, amount * -1) : shadeColor(color, amount);
};

export const INITIAL_NOTE_ID = '111';

export const getNewCustomNoteLabelName = (chosenLabel: ICustomNoteLabel, hasColor: boolean = true) => {
    return `${SEPARATOR}${chosenLabel.name}${hasColor ? COLOR_SEPARATOR : ''}${hasColor ? chosenLabel.color || '' : ''}`;
};

export const getInitialNote = (author: IUser): INote => {
    return {
        _id: INITIAL_NOTE_ID,
        title: 'Started using Bullet Journal',
        author: author,
        startDate: new Date(author.createdAt || new Date()).getTime(),
        endDate: new Date(author.createdAt || new Date()).getTime(),
        content: 'That day I registered an account on the Bullet Journal website.',
        color: '#04a9c6',
        type: 'Event',
        rating: 1
    };
};

// "_SEP_Thought_COL_#fa83ce_SEP_Lifetime_COL_#aa841e_SEP_New_SEP_Training_SEP_Work_SEP_Turntable"
export function getCustomLabels(customLabels: string | undefined): ICustomNoteLabel[] {
    const res =
        customLabels?.split(SEPARATOR).map((label) => {
            const [labelName, labelColor] = label.split(COLOR_SEPARATOR);
            return {
                name: labelName,
                color: labelColor
            };
        }) || [];
    return res;
}

export function getAllLabels(isTypes: boolean, customLabels: string | undefined, additionalLabels?: ICustomNoteLabel[]): ICustomNoteLabel[] {
    const allLabels = [...(isTypes ? defaultNoteTypes : []), ...(additionalLabels || []), ...getCustomLabels(customLabels)].filter((label) => label.name !== '');
    return allLabels;
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
export function dateDiffInDays(a: Date, b: Date) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
}

export const areArraysEqual = (firstArray: any[], secondArray: any[]) => {
    return firstArray.every(function (element) {
        return secondArray.includes(element);
    });
};
