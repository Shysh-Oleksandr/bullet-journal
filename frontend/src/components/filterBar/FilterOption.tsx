import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { BsDashLg } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import { useOnClickOutside } from '../../hooks';
import { areArraysEqual, getAllLabels } from '../../utils/functions';
import InputLabel from '../note/InputLabel';
import NoteDate from '../note/NoteDate';
import NoteImportanceInput from '../note/NoteImportanceInput';
import { defaultNoteTypes, FilterOptions, getDateOptions, getLastPeriodDate, IFilterOption, importanceFilterOptions, sortOptions } from './../../utils/data';
import FilterModal from './FilterModal';
import FilterModalOption from './FilterModalOption';

interface FilterOptionProps {
    option: IFilterOption;
    filterData: {
        sortType: string;
        startDate: number;
        endDate: number;
        type: string[];
        category: string[];
        importanceMin: number;
        importanceMax: number;
        showNoCategory: boolean;
        wasReset: boolean;
        veryStartDate: number;
    };
    filterDataSetters: {
        setSortType: React.Dispatch<React.SetStateAction<string>>;
        setStartDate: React.Dispatch<React.SetStateAction<number>>;
        setEndDate: React.Dispatch<React.SetStateAction<number>>;
        setType: React.Dispatch<React.SetStateAction<string[]>>;
        setCategory: React.Dispatch<React.SetStateAction<string[]>>;
        setImportanceMin: React.Dispatch<React.SetStateAction<number>>;
        setImportanceMax: React.Dispatch<React.SetStateAction<number>>;
        setShowNoCategory: React.Dispatch<React.SetStateAction<boolean>>;
    };
}

const FilterOption = ({ option, filterData, filterDataSetters }: FilterOptionProps) => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [optionsChosen, setOptionsChosen] = useState<number | undefined>(undefined);
    const [modalProps, setModalProps] = useState({ content: '' });
    const modalRef = useRef() as MutableRefObject<HTMLDivElement>;
    const optionRef = useRef() as MutableRefObject<HTMLDivElement>;
    const dateDashRef = useRef() as MutableRefObject<HTMLDivElement>;
    const importanceDashRef = useRef() as MutableRefObject<HTMLDivElement>;
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
                content = (
                    <div>
                        {sortOptions.map((option) => {
                            return (
                                <FilterModalOption
                                    key={option.name + '_importance_option'}
                                    // forceCheck={checkImportanceChosen(option.min, option.max)}
                                    // onchange={() => chooseImportance(option.min, option.max)}
                                    text={option.name}
                                    showCheckmark={false}
                                    canToggle={false}
                                    refToClick={importanceDashRef}
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
                const types: string[] = getAllLabels(defaultNoteTypes, user.customNoteTypes);
                setOptionsChosen(filterData.type.length);

                content = (
                    <div>
                        {types.map((type) => {
                            return <FilterModalOption onchange={checkLabel} checkedAtStart={filterData.type.includes(type)} text={type} key={type + '_type'} />;
                        })}
                    </div>
                );
                break;

            case FilterOptions.CATEGORY:
                checkLabel = (label: string) => {
                    setOptionsChosen(filterData.category.includes(label) ? filterData.category.length - 1 : filterData.category.length + 1);
                    filterDataSetters.setCategory((prevCategory) => (!prevCategory.includes(label) ? [...prevCategory, label] : prevCategory.filter((chosenLabel) => chosenLabel !== label)));
                };
                const toggleShowNoCategories = (label: string, checked: boolean | undefined) => {
                    filterDataSetters.setShowNoCategory(checked!);
                };
                const categories: string[] = getAllLabels([], user.customNoteCategories);
                setOptionsChosen(filterData.category.length);

                content = (
                    <div>
                        <FilterModalOption checkedAtStart={filterData.showNoCategory} onchange={toggleShowNoCategories} text="No categories" />
                        {categories.map((category) => {
                            return <FilterModalOption onchange={checkLabel} checkedAtStart={filterData.category.includes(category)} text={category} key={category + '_category'} />;
                        })}
                    </div>
                );
                break;
            case FilterOptions.DATE:
                const chooseDatePeriod = (startDate: number, endDate: number = new Date().getTime()) => {
                    const _stardDate = new Date(startDate);
                    _stardDate.setHours(0, 0, 0, 0);
                    filterDataSetters.setStartDate(_stardDate.getTime());
                    filterDataSetters.setEndDate(endDate);
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
                        <div className="fl mb-8">
                            <NoteDate
                                refToClick={dateDashRef}
                                date={filterData.startDate}
                                setDate={filterDataSetters.setStartDate}
                                inputClassname="border-2 border-solid border-cyan-100 px-2 rounded-md"
                                isStartDate={true}
                            />
                            <div ref={dateDashRef}>
                                <BsDashLg className="mx-6 text-xl" />
                            </div>
                            <NoteDate
                                refToClick={dateDashRef}
                                date={filterData.endDate}
                                setDate={filterDataSetters.setEndDate}
                                inputClassname="border-2 border-solid border-cyan-100 px-2 rounded-md"
                                isStartDate={false}
                            />
                        </div>
                        {getDateOptions(filterData.veryStartDate).map((option) => {
                            return (
                                <FilterModalOption
                                    key={option.name + '_date_option'}
                                    refToClick={dateDashRef}
                                    forceCheck={checkDatePeriodChosen(option.startDate)}
                                    onchange={() => chooseDatePeriod(option.startDate)}
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
                const chooseImportance = (min: number, max: number) => {
                    filterDataSetters.setImportanceMin(min);
                    filterDataSetters.setImportanceMax(max);
                };
                const checkImportanceChosen = (min: number, max: number) => {
                    return filterData.importanceMin === min && filterData.importanceMax === max;
                };
                content = (
                    <div>
                        <div className="flex-between mb-8 mx-6">
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
                                        onchange={() => chooseImportance(option.min, option.max)}
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
    };

    return (
        <div
            ref={optionRef}
            onClick={() => openDropdown()}
            className={`filter-option cursor-pointer relative flex-between mx-3 px-4 py-3 mt-2 flex-1 rounded-lg shadow-md text-cyan-700 transition-all duration-[250ms] ${
                isModalOpened ? '!bg-cyan-600 !text-white !shadow-lg focused' : ''
            } hover:bg-cyan-600 hover:text-white hover:shadow-lg`}
        >
            <div className="fl">
                <span className="text-2xl mr-2">{<option.icon />}</span>
                <h4 className="text-lg whitespace-nowrap">
                    {option.name}
                    {optionsChosen !== undefined && ` (${optionsChosen})`}
                </h4>
            </div>
            <span className={`text-2xl ml-1 text-cyan-500 filter-arrow transition-all duration-[250ms] ${isModalOpened ? 'opened' : 'closed'}`}>
                <IoIosArrowDown />
            </span>
            {isModalOpened && <FilterModal optionRef={optionRef} content={modalProps.content} modalRef={modalRef} />}
        </div>
    );
};

export default FilterOption;
