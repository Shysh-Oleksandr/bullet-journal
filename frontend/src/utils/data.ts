import { IconType } from 'react-icons';
import { AiOutlineStar } from 'react-icons/ai';
import { BiCalendarAlt, BiCategory } from 'react-icons/bi';
import { IoIosJournal } from 'react-icons/io';
import { MdSort } from 'react-icons/md';

export interface ICustomNoteLabel {
    name: string;
    color?: string;
}

export const noteColors: string[] = [
    '#E89005',
    '#E70E02',
    '#1B998B',
    '#FFFD82',
    '#2D3047',
    '#FCDE9C',
    '#C4D6B0',
    '#FFFFFF',
    '#D2D7DF',
    '#BDBBB0',
    '#8A897C',
    '#E365C1',
    '#101419',
    '#ADD9F4',
    '#4F518C'
];

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
            shortName: 'any',
            startDate: veryStartDate
        },
        {
            name: 'Last week',
            shortName: 'week',
            startDate: getLastPeriodDate(7)
        },
        {
            name: 'Last month',
            shortName: 'month',
            startDate: getLastPeriodDate(30)
        },
        {
            name: 'Last 6 months',
            shortName: '6 months',
            startDate: getLastPeriodDate(183)
        },
        {
            name: 'Last year',
            shortName: 'year',
            startDate: getLastPeriodDate(365)
        }
    ];
};

export const importanceFilterOptions = [
    {
        name: 'Any importance',
        shortName: 'any',
        min: 1,
        max: 10
    },
    {
        name: 'High (7-10)',
        shortName: 'high',
        min: 7,
        max: 10
    },
    {
        name: 'Medium (4-6)',
        shortName: 'medium',
        min: 4,
        max: 6
    },
    {
        name: 'Low (1-3)',
        shortName: 'low',
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
    ALPHABETICAL = 'alphabetically',
    CONTENT = 'content'
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
        name: 'By content',
        sortType: SortOptions.CONTENT
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
