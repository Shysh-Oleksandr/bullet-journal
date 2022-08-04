import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { BsDashLg } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import { useFetchData, useOnClickOutside } from '../../hooks';
import { FilterOptions, getDateOptions, IFilterOption, importanceFilterOptions, SortOptions, sortOptions } from './../../utils/data';
import FilterModal from './FilterModal';
import FilterModalOption from './FilterModalOption';
import NoteDate from './../note/noteForm/NoteDate';
import NoteImportanceInput from './../note/noteForm/NoteImportanceInput';
import InputLabel from './../note/noteForm/InputLabel';
import ICustomLabel from '../../interfaces/customLabel';

interface FilterOptionProps {
    option: IFilterOption;
    setShowFullAddForm: React.Dispatch<React.SetStateAction<boolean>>;
    filterData: {
        sortType: SortOptions;
        startDate: number;
        endDate: number;
        type: string[];
        category: string[];
        importanceMin: number;
        importanceMax: number;
        showAnyCategory: boolean;
        showAnyType: boolean;
        wasReset: boolean;
        oldestNoteDate: number;
        allTypes: ICustomLabel[];
        allCategories: ICustomLabel[];
    };
    filterDataSetters: {
        setSortType: React.Dispatch<React.SetStateAction<SortOptions>>;
        setStartDate: React.Dispatch<React.SetStateAction<number>>;
        setEndDate: React.Dispatch<React.SetStateAction<number>>;
        setType: React.Dispatch<React.SetStateAction<string[]>>;
        setCategory: React.Dispatch<React.SetStateAction<string[]>>;
        setImportanceMin: React.Dispatch<React.SetStateAction<number>>;
        setImportanceMax: React.Dispatch<React.SetStateAction<number>>;
        setShowAnyCategory: React.Dispatch<React.SetStateAction<boolean>>;
        setShowAnyType: React.Dispatch<React.SetStateAction<boolean>>;
    };
}

const FilterOption = ({ option, filterData, filterDataSetters, setShowFullAddForm }: FilterOptionProps) => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [optionsChosen, setOptionsChosen] = useState<number | string | undefined>(undefined);
    const [modalProps, setModalProps] = useState({ content: '' });
    const modalRef = useRef() as MutableRefObject<HTMLDivElement>;
    const optionRef = useRef() as MutableRefObject<HTMLDivElement>;
    const dateDashRef = useRef() as MutableRefObject<HTMLDivElement>;
    const importanceDashRef = useRef() as MutableRefObject<HTMLDivElement>;
    const sortingRef = useRef() as MutableRefObject<HTMLDivElement>;
    useOnClickOutside(modalRef, () => setIsModalOpened(false));
    const { user } = useAppSelector((store) => store.user);

    useEffect(() => {
        setOptionsChosen(undefined);
    }, [filterData.wasReset]);

    const openDropdown = () => {
        let content;
        let checkLabel;
        switch (option.name) {
            case FilterOptions.SORT:
                setOptionsChosen(filterData.sortType.toString());

                content = (
                    <div>
                        <span ref={sortingRef}></span>
                        {sortOptions.map((option) => {
                            return (
                                <FilterModalOption
                                    key={option.name + '_importance_option'}
                                    forceCheck={filterData.sortType === option.sortType}
                                    onchange={() => filterDataSetters.setSortType(option.sortType)}
                                    text={option.name}
                                    showCheckmark={false}
                                    canToggle={false}
                                    refToClick={sortingRef}
                                />
                            );
                        })}
                    </div>
                );
                break;

            case FilterOptions.TYPE:
                checkLabel = (label: string) => {
                    setOptionsChosen(filterData.type.includes(label) ? filterData.type.length - 1 : filterData.type.length + 1);
                    filterDataSetters.setType((prevType) => (!prevType.includes(label) ? [...prevType, label] : prevType.filter((chosenLabel) => chosenLabel !== label)));
                };
                const toggleShowAnyTypes = (label: string, checked: boolean | undefined) => {
                    filterDataSetters.setShowAnyType(checked!);
                };
                setOptionsChosen(filterData.type.length);

                content = (
                    <div>
                        <FilterModalOption checkedAtStart={filterData.showAnyType} onchange={toggleShowAnyTypes} text="Any types" />
                        {filterData.allTypes.map((type) => {
                            return <FilterModalOption onchange={checkLabel} checkedAtStart={filterData.type.includes(type.labelName)} text={type.labelName} key={type._id} />;
                        })}
                    </div>
                );
                break;

            case FilterOptions.CATEGORY:
                checkLabel = (label: string) => {
                    setOptionsChosen(filterData.category.includes(label) ? filterData.category.length - 1 : filterData.category.length + 1);
                    filterDataSetters.setCategory((prevCategory) => (!prevCategory.includes(label) ? [...prevCategory, label] : prevCategory.filter((chosenLabel) => chosenLabel !== label)));
                };
                const toggleShowAnyCategories = (label: string, checked: boolean | undefined) => {
                    filterDataSetters.setShowAnyCategory(checked!);
                };
                setOptionsChosen(filterData.category.length);

                content = (
                    <div>
                        <FilterModalOption checkedAtStart={filterData.showAnyCategory} onchange={toggleShowAnyCategories} text="Any categories" />
                        {filterData.allCategories.map((category) => {
                            return <FilterModalOption onchange={checkLabel} checkedAtStart={filterData.category.includes(category.labelName)} text={category.labelName} key={category._id} />;
                        })}
                    </div>
                );
                break;
            case FilterOptions.DATE:
                const chooseDatePeriod = (startDate: number, periodName: string | undefined = undefined, endDate: number = new Date().getTime()) => {
                    const _stardDate = new Date(startDate);
                    _stardDate.setHours(0, 0, 0, 0);
                    filterDataSetters.setStartDate(_stardDate.getTime());
                    filterDataSetters.setEndDate(endDate);
                    setOptionsChosen(periodName);
                };
                const checkDatePeriodChosen = (startDate: number, endDate: number = new Date().getTime()) => {
                    const _stardDate = new Date(startDate);
                    const _endDate = new Date(endDate);
                    const stardD = new Date(filterData.startDate);
                    const endD = new Date(filterData.endDate);
                    _stardDate.setHours(0, 0, 0, 0);
                    _endDate.setHours(0, 0, 0, 0);
                    stardD.setHours(0, 0, 0, 0);
                    endD.setHours(0, 0, 0, 0);

                    return stardD.getTime() === _stardDate.getTime() && endD.getTime() === _endDate.getTime();
                };

                content = (
                    <>
                        <div className="fl sm:mb-8 mb-6 justify-center sm:flex-row flex-col">
                            <NoteDate
                                refToClick={dateDashRef}
                                date={filterData.startDate}
                                setDate={filterDataSetters.setStartDate}
                                inputClassname="border-2 border-solid border-cyan-100 px-2 rounded-md"
                                isStartDate={true}
                            />
                            <div ref={dateDashRef}>
                                <BsDashLg className="mx-6 text-xl block sm:my-0 mt-4 mb-1" />
                            </div>
                            <NoteDate
                                refToClick={dateDashRef}
                                date={filterData.endDate}
                                setDate={filterDataSetters.setEndDate}
                                inputClassname="border-2 border-solid border-cyan-100 px-2 rounded-md"
                                isStartDate={false}
                            />
                        </div>
                        {getDateOptions(filterData.oldestNoteDate).map((option) => {
                            return (
                                <FilterModalOption
                                    key={option.name + '_date_option'}
                                    refToClick={dateDashRef}
                                    forceCheck={checkDatePeriodChosen(option.startDate)}
                                    onchange={() => chooseDatePeriod(option.startDate, option.shortName)}
                                    text={option.name}
                                    showCheckmark={false}
                                    canToggle={false}
                                />
                            );
                        })}
                    </>
                );
                break;
            case FilterOptions.IMPORTANCE:
                const chooseImportance = (min: number, max: number, shortName: string | undefined = undefined) => {
                    filterDataSetters.setImportanceMin(min);
                    filterDataSetters.setImportanceMax(max);
                    setOptionsChosen(shortName);
                };
                const checkImportanceChosen = (min: number, max: number) => {
                    return filterData.importanceMin === min && filterData.importanceMax === max;
                };
                content = (
                    <div>
                        <div className="flex-between sm:mb-8 mb-6 sm:mx-6 mx-4">
                            <div className="fl relative">
                                <NoteImportanceInput importance={filterData.importanceMin} setImportance={filterDataSetters.setImportanceMin} inputId="noteImportanceMinFilterOption" />
                                <InputLabel htmlFor="noteImportanceMinFilterOption" text="Min" />
                            </div>
                            <div ref={importanceDashRef}>
                                <BsDashLg className="mx-6 text-xl" />
                            </div>
                            <div className="fl relative">
                                <NoteImportanceInput importance={filterData.importanceMax} setImportance={filterDataSetters.setImportanceMax} inputId="noteImportanceMaxFilterOption" />
                                <InputLabel htmlFor="noteImportanceMaxFilterOption" text="Max" />
                            </div>
                        </div>
                        <div>
                            {importanceFilterOptions.map((option) => {
                                return (
                                    <FilterModalOption
                                        key={option.name + '_importance_option'}
                                        forceCheck={checkImportanceChosen(option.min, option.max)}
                                        onchange={() => chooseImportance(option.min, option.max, option.shortName)}
                                        text={option.name}
                                        showCheckmark={false}
                                        canToggle={false}
                                        refToClick={importanceDashRef}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
                break;

            default:
                break;
        }

        setModalProps({ content });
        setIsModalOpened(true);
        setShowFullAddForm(false);
    };

    return (
        <div
            ref={optionRef}
            onClick={() => openDropdown()}
            className={`filter-option min-w-[12rem] cursor-pointer relative flex-between mx-3 pl-4 pr-7 py-3 mt-2 flex-1 xs:basis-[15%] basis-full rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] ${
                isModalOpened ? '!bg-cyan-600 !text-white !shadow-lg focused' : ''
            } hover:bg-cyan-600 hover:text-white hover:shadow-lg`}
        >
            <div className="fl flex-1">
                <span className="text-2xl mr-2">{<option.icon />}</span>
                <h4 className="text-lg whitespace-nowrap overflow-hidden text-ellipsis text-left xs:max-w-[80%] flex-1">
                    {option.name}
                    {optionsChosen !== undefined && optionsChosen !== 0 && ` (${optionsChosen})`}
                </h4>
            </div>
            <span className={`text-2xl absolute right-2 top-4 text-cyan-500 filter-arrow transition-all duration-[250ms] ${isModalOpened ? 'opened' : 'closed'}`}>
                <IoIosArrowDown />
            </span>
            {isModalOpened && <FilterModal optionRef={optionRef} content={modalProps.content} modalRef={modalRef} />}
        </div>
    );
};

export default FilterOption;
