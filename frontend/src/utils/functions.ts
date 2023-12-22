import DOMPurify from 'dompurify';
import tinycolor from 'tinycolor2';
import { noteColors } from './data';
import { CustomLabel } from '../features/journal/types';

export function shadeColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, (color) => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export const sanitizedData = (data: string): string => DOMPurify.sanitize(data);

export const getShadedColor = (color: string, amount: number = 20) => {
    const tinyColor = tinycolor(color);

    return tinyColor.isLight() ? shadeColor(color, amount * -1) : shadeColor(color, amount);
};

export const getDifferentColor = (color: string, amount: number = 25, shouldReverse = false) => {
    const tinyColor = tinycolor(color);

    let differentColor = tinyColor;

    if (tinyColor.isLight()) {
        differentColor = shouldReverse ? tinyColor.brighten(amount) : tinyColor.darken(amount);
    } else {
        differentColor = shouldReverse ? tinyColor.darken(amount) : tinyColor.brighten(amount);
    }

    return differentColor.toString('hex');
};

export const getLinearGradientStyle = (bgColor: string, topColorDifference = 10, bottomColorDifference = -15, shouldReverseColors = false) => {
    return { background: `linear-gradient(${getDifferentColor(bgColor, topColorDifference, shouldReverseColors)}, ${getDifferentColor(bgColor, bottomColorDifference, shouldReverseColors)})` };
};

export const getCategoriesLabelName = (categories: CustomLabel[]) => {
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
