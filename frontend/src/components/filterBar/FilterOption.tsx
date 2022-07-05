import React from 'react';
import { FilterOptions, IFilterOption } from './../../utils/data';
import { IoIosArrowDown } from 'react-icons/io';

interface FilterOptionProps {
    option: IFilterOption;
    filterData: {
        sortType: string;
        startDate: number;
        endDate: number;
        type: string;
        category: string;
        importance: number;
    };
    filterDataSetters: {
        setSortType: React.Dispatch<React.SetStateAction<string>>;
        setStartDate: React.Dispatch<React.SetStateAction<number>>;
        setEndDate: React.Dispatch<React.SetStateAction<number>>;
        setType: React.Dispatch<React.SetStateAction<string>>;
        setCategory: React.Dispatch<React.SetStateAction<string>>;
        setImportance: React.Dispatch<React.SetStateAction<number>>;
    };
}

const FilterOption = ({ option, filterData, filterDataSetters }: FilterOptionProps) => {
    const openDropdown = () => {
        switch (option.name) {
            case FilterOptions.SORT:
                console.log(filterData.sortType, filterDataSetters.setSortType('sort'));
                break;

            case FilterOptions.TYPE:
                console.log(filterData.type, filterDataSetters.setType('yp'));
                break;

            case FilterOptions.CATEGORY:
                console.log(filterData.category, filterDataSetters.setCategory('fe, we'));
                break;
            case FilterOptions.DATE:
                console.log(filterData.startDate, filterDataSetters.setStartDate(1));
                console.log(filterData.endDate, filterDataSetters.setEndDate(4));
                break;
            case FilterOptions.IMPORTANCE:
                console.log(filterData.importance, filterDataSetters.setImportance(8));
                break;

            default:
                break;
        }
    };

    return (
        <button
            onClick={() => openDropdown()}
            className="filter-option flex-between mx-3 px-4 py-3 mt-2 flex-1 rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] hover:bg-cyan-600 hover:text-white hover:shadow-lg"
        >
            <div className="fl">
                <span className="text-2xl mr-2">{<option.icon />}</span>
                <h4 className="text-lg whitespace-nowrap">{option.name}</h4>
            </div>
            {option.isDropdown && (
                <span className="text-2xl ml-1 text-cyan-500 filter-arrow transition-all duration-[250ms]">
                    <IoIosArrowDown />
                </span>
            )}
        </button>
    );
};

export default FilterOption;
