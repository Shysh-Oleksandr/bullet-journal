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
    isDropdown: boolean;
    data?: any;
}

export enum FilterOptions {
    SORT = 'Sort by Date',
    DATE = 'Any Date',
    TYPE = 'Type',
    CATEGORY = 'Category',
    IMPORTANCE = 'Importance'
}

export const filterOptions: IFilterOption[] = [
    {
        name: FilterOptions.SORT,
        icon: MdSort,
        isDropdown: true
    },
    {
        name: FilterOptions.DATE,
        icon: BiCalendarAlt,
        isDropdown: true
    },
    {
        name: FilterOptions.TYPE,
        icon: IoIosJournal,
        isDropdown: true,
        data: {}
    },
    {
        name: FilterOptions.CATEGORY,
        icon: BiCategory,
        isDropdown: true
    },
    {
        name: FilterOptions.IMPORTANCE,
        icon: AiOutlineStar,
        isDropdown: true
    }
    // {
    //     name: 'Search',
    //     icon: AiOutlineSearch,
    //     isDropdown: false
    // }
];
