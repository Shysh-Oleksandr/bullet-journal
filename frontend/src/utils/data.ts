import { IconType } from 'react-icons';
import { AiOutlineStar } from 'react-icons/ai';
import { BiCalendarAlt, BiCategory } from 'react-icons/bi';
import { IoIosJournal } from 'react-icons/io';
import { MdSort } from 'react-icons/md';

export const defaultNoteTypes: string[] = ['Note', 'Event', 'Diary', 'Habit'];

export const SEPARATOR = '_SEP_';

export interface IFilterOption {
    name: string;
    icon: IconType;
}

export enum FilterOptions {
    SORT = 'Sort by Date',
    DATE = 'Date',
    TYPE = 'Type',
    CATEGORY = 'Category',
    IMPORTANCE = 'Importance'
}

export const filterOptions: IFilterOption[] = [
    {
        name: FilterOptions.SORT,
        icon: MdSort
    },
    {
        name: FilterOptions.DATE,
        icon: BiCalendarAlt
    },
    {
        name: FilterOptions.TYPE,
        icon: IoIosJournal
    },
    {
        name: FilterOptions.CATEGORY,
        icon: BiCategory
    },
    {
        name: FilterOptions.IMPORTANCE,
        icon: AiOutlineStar
    }
];

export function getLastPeriodDate(days: number, date?: number) {
    const now = new Date(date || new Date().getTime());

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - days).getTime();
}
