import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { defaultNoteTypes, FilterOptions, IFilterOption, SEPARATOR } from './../../utils/data';
import { IoIosArrowDown } from 'react-icons/io';
import FilterModal from './FilterModal';
import { useOnClickOutside } from '../../hooks';
import { useAppSelector } from '../../app/hooks';
import FilterModalOption from './FilterModalOption';
import NoteDate from '../note/NoteDate';
import { BsDashLg } from 'react-icons/bs';
import { getAllLabels } from '../../utils/functions';

interface FilterOptionProps {
    option: IFilterOption;
    filterData: {
        sortType: string;
        startDate: number;
        endDate: number;
        type: string[];
        category: string[];
        importance: number;
    };
    filterDataSetters: {
        setSortType: React.Dispatch<React.SetStateAction<string>>;
        setStartDate: React.Dispatch<React.SetStateAction<number>>;
        setEndDate: React.Dispatch<React.SetStateAction<number>>;
        setType: React.Dispatch<React.SetStateAction<string[]>>;
        setCategory: React.Dispatch<React.SetStateAction<string[]>>;
        setImportance: React.Dispatch<React.SetStateAction<number>>;
    };
}

const FilterOption = ({ option, filterData, filterDataSetters }: FilterOptionProps) => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState({ content: '' });
    const modalRef = useRef() as MutableRefObject<HTMLDivElement>;
    useOnClickOutside(modalRef, () => setIsModalOpened(false));
    const { user } = useAppSelector((store) => store.user);

    const openDropdown = () => {
        let content;
        let checkLabel;
        switch (option.name) {
            case FilterOptions.SORT:
                content = (
                    <div>
                        <FilterModalOption text={'By date(new first)'} />
                        <FilterModalOption text={'By date(old first)'} />
                        <FilterModalOption text={'By importance'} />
                        <FilterModalOption text={'By type'} />
                        <FilterModalOption text={'By category'} />
                        <FilterModalOption text={'By title'} />
                    </div>
                );
                break;

            case FilterOptions.TYPE:
                checkLabel = (label: string, isFirstIteration: boolean = false) => {
                    filterDataSetters.setType((prevType) => (isFirstIteration ? prevType : !prevType.includes(label) ? [...prevType, label] : prevType.filter((chosenLabel) => chosenLabel !== label)));
                };
                const types: string[] = getAllLabels(defaultNoteTypes, user.customNoteTypes);

                content = (
                    <div>
                        {types.map((type) => {
                            return <FilterModalOption text={type} key={type + '_type'} onchange={checkLabel} checkedAtStart={filterData.type.includes(type)} />;
                        })}
                    </div>
                );
                break;

            case FilterOptions.CATEGORY:
                checkLabel = (label: string, isFirstIteration: boolean = false) => {
                    filterDataSetters.setCategory((prevCategory) =>
                        isFirstIteration ? prevCategory : !prevCategory.includes(label) ? [...prevCategory, label] : prevCategory.filter((chosenLabel) => chosenLabel !== label)
                    );
                };
                const categories: string[] = getAllLabels([], user.customNoteCategories);
                content = (
                    <div>
                        {categories.map((category) => {
                            return <FilterModalOption text={category} key={category + '_category'} onchange={checkLabel} checkedAtStart={filterData.category.includes(category)} />;
                        })}
                    </div>
                );
                break;
            case FilterOptions.DATE:
                content = (
                    <>
                        <div className="fl mb-8">
                            <NoteDate date={filterData.startDate} setDate={filterDataSetters.setStartDate} inputClassname="border-2 border-solid border-cyan-100 px-2 rounded-md" isStartDate={true} />
                            <BsDashLg className="mx-6 text-xl" />
                            <NoteDate date={filterData.endDate} setDate={filterDataSetters.setEndDate} inputClassname="border-2 border-solid border-cyan-100 px-2 rounded-md" isStartDate={false} />
                        </div>
                        <FilterModalOption text={'Today'} />
                        <FilterModalOption text={'Last week'} />
                        <FilterModalOption text={'Last month'} />
                        <FilterModalOption text={'Last 6 months'} />
                        <FilterModalOption text={'Last year'} />
                    </>
                );
                break;
            case FilterOptions.IMPORTANCE:
                break;

            default:
                break;
        }

        setModalProps({ content });
        setIsModalOpened(true);
    };

    return (
        <button
            onClick={() => openDropdown()}
            className={`filter-option relative flex-between mx-3 px-4 py-3 mt-2 flex-1 rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] ${
                isModalOpened ? '!bg-cyan-600 !text-white !shadow-lg focused' : ''
            } hover:bg-cyan-600 hover:text-white hover:shadow-lg`}
        >
            <div className="fl">
                <span className="text-2xl mr-2">{<option.icon />}</span>
                <h4 className="text-lg whitespace-nowrap">{option.name}</h4>
            </div>
            <span className={`text-2xl ml-1 text-cyan-500 filter-arrow transition-all duration-[250ms] ${isModalOpened ? 'opened' : 'closed'}`}>
                <IoIosArrowDown />
            </span>
            {isModalOpened && <FilterModal content={modalProps.content} modalRef={modalRef} />}
        </button>
    );
};

export default FilterOption;
