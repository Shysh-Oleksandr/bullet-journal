import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import { filterOptions } from './../../utils/data';
import FilterOption from './FilterOption';
import { useAppDispatch } from './../../app/hooks';
import { updateUserData } from './../../features/user/userSlice';
interface FilterBarProps {
    filterBarRef: React.MutableRefObject<HTMLDivElement>;
}

const FilterBar = ({ filterBarRef }: FilterBarProps) => {
    const { user } = useAppSelector((store) => store.user);
    const dispatch = useAppDispatch();
    return (
        <div
            ref={filterBarRef}
            className={`w-full absolute top-0 z-[99] left-0 right-0 pb-4 pt-2 rounded-b-xl shadow-md duration-500 ease-in-out bg-white fl justify-between flex-wrap px-[3vw] ${
                user.isFilterBarShown ? '' : '-translate-y-[92%] max-h-36'
            }`}
        >
            {filterOptions.map((option) => {
                return <FilterOption option={option} key={option.name} />;
            })}
            <span
                onClick={() => dispatch(updateUserData({ oldUser: user, newUserData: { isFilterBarShown: !user.isFilterBarShown } }))}
                className={`text-4xl absolute -bottom-7 text-cyan-600 z-50 cursor-pointer transition-all duration-300 block right-4 ${user.isFilterBarShown ? 'rotate-180' : ''} hover:text-cyan-700`}
            >
                <IoIosArrowDown />
            </span>
        </div>
    );
};

export default FilterBar;
