import DOMPurify from 'dompurify';
import tinycolor from 'tinycolor2';
import IUser from './../interfaces/user';
import INote from './../interfaces/note';

export function shadeColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, (color) => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export const sanitizedData = (data: string): string => DOMPurify.sanitize(data);

export const getDifferentColor = (color: string, amount: number = 20) => {
    const tinyColor = tinycolor(color);

    return tinyColor.isLight() ? shadeColor(color, amount * -1) : shadeColor(color, amount);
};

export const getInitialNote = (author: IUser): INote => {
    return {
        _id: '111',
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
