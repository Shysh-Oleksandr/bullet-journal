import DOMPurify from 'dompurify';
import tinycolor from 'tinycolor2';
import ICustomLabel from '../interfaces/customLabel';
import INote from '../interfaces/note';
import IUser from '../interfaces/user';
import { defaultNoteTypes, noteColors } from './data';

export function shadeColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, (color) => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export const sanitizedData = (data: string): string => DOMPurify.sanitize(data);

export const getDifferentColor = (color: string, amount: number = 20) => {
    const tinyColor = tinycolor(color);

    return tinyColor.isLight() ? shadeColor(color, amount * -1) : shadeColor(color, amount);
};

export const INITIAL_NOTE_ID = '111';

export const getInitialNote = (author: IUser): INote => {
    return {
        _id: INITIAL_NOTE_ID,
        title: 'Started using Bullet Journal',
        author: author,
        startDate: new Date(author.createdAt || new Date()).getTime(),
        endDate: new Date(author.createdAt || new Date()).getTime(),
        content: 'That day I registered an account on the Bullet Journal website.',
        color: '#04a9c6',
        type: defaultNoteTypes[1],
        rating: 1
    };
};

export const getCategoriesLabelName = (categories: ICustomLabel[]) => {
    const categoriesLabelName: string = categories.map((category) => category.labelName).join(', ');
    return categoriesLabelName;
};

export const getRandomColor = () => {
    return noteColors[Math.floor(Math.random() * noteColors.length)];
};

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

export const getContentWords = (content: string) => {
    return content
        .trim()
        .split(/\s+/)
        .filter((row) => row.trim() !== '<p></p>').length;
};
