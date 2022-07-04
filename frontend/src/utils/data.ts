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
}

export const filterOptions: IFilterOption[] = [
    {
        name: 'Sort by Date',
        icon: MdSort,
        isDropdown: true
    },
    {
        name: 'Any Date',
        icon: BiCalendarAlt,
        isDropdown: true
    },
    {
        name: 'Type',
        icon: IoIosJournal,
        isDropdown: true
    },
    {
        name: 'Category',
        icon: BiCategory,
        isDropdown: true
    },
    {
        name: 'Importance',
        icon: AiOutlineStar,
        isDropdown: true
    }
    // {
    //     name: 'Search',
    //     icon: AiOutlineSearch,
    //     isDropdown: false
    // }
];
