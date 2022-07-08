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
    SORT = 'Sort',
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

export const getDateOptions = (veryStartDate: number) => {
    return [
        {
            name: 'Any Date',
            startDate: veryStartDate
        },
        {
            name: 'Last week',
            startDate: getLastPeriodDate(7)
        },
        {
            name: 'Last month',
            startDate: getLastPeriodDate(30)
        },
        {
            name: 'Last 6 months',
            startDate: getLastPeriodDate(183)
        },
        {
            name: 'Last year',
            startDate: getLastPeriodDate(365)
        }
    ];
};

export const importanceFilterOptions = [
    {
        name: 'Any importance',
        min: 1,
        max: 10
    },
    {
        name: 'Great (7-10)',
        min: 7,
        max: 10
    },
    {
        name: 'Medium (4-6)',
        min: 4,
        max: 6
    },
    {
        name: 'Low (1-3)',
        min: 1,
        max: 3
    }
];

export enum SortOptions {
    NEWEST = 'newest',
    OLDEST = 'oldest',
    IMPORTANCE = 'importance',
    TYPE = 'type',
    CATEGORY = 'categories',
    ALPHABETICAL = 'alphabetically'
}

export const sortOptions = [
    {
        name: 'By date (newest)',
        sortType: SortOptions.NEWEST
    },
    {
        name: 'By date (oldest)',
        sortType: SortOptions.OLDEST
    },
    {
        name: 'By importance',
        sortType: SortOptions.IMPORTANCE
    },
    {
        name: 'By type',
        sortType: SortOptions.TYPE
    },
    {
        name: 'By categories',
        sortType: SortOptions.CATEGORY
    },
    {
        name: 'Alphabetically',
        sortType: SortOptions.ALPHABETICAL
    }
];
export function getLastPeriodDate(days: number, date?: number) {
    const now = new Date(date || new Date().getTime());

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - days).getTime();
}
