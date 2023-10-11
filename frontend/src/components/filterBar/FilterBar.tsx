import React, { memo, useCallback, useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import config from '../../config/config';
import { fetchAllNotes, setShowFilterBar } from '../../features/journal/journalSlice';
import { useDebounce, useFetchData } from '../../hooks';
import ICustomLabel from '../../interfaces/customLabel';
import { useAppDispatch } from './../../app/hooks';
import INote from './../../interfaces/note';
import { SortOptions, filterOptions, getLastPeriodDate } from './../../utils/data';
import { getContentWords } from './../../utils/functions';
import FilterOption from './FilterOption';
import FilterSearchInput from './FilterSearchInput';

interface FilterBarProps {
  filterBarRef: React.MutableRefObject<HTMLDivElement>;
  setShowFullAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterBar = ({ filterBarRef, setShowFullAddForm }: FilterBarProps) => {
  const { user } = useAppSelector((store) => store.user);
  const [customLabels] = useFetchData<ICustomLabel>('GET', `${config.server.url}/customlabels/${user._id}`, 'customLabels');
  const allTypes = customLabels.filter((label) => !label.isCategoryLabel);
  const allCategories = customLabels.filter((label) => label.isCategoryLabel);
  const { oldestNoteDate } = useAppSelector((store) => store.journal);
  const { isFilterBarShown } = useAppSelector((store) => store.journal);
  const dispatch = useAppDispatch();
  const [wasReset, setWasReset] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortOptions>(SortOptions.NEWEST);
  const [startDate, setStartDate] = useState<number>(oldestNoteDate);

  const [endDate, setEndDate] = useState<number>(new Date().getTime());
  const [type, setType] = useState<string[]>(allTypes.map((label) => label.labelName));
  const [category, setCategory] = useState<string[]>(allCategories.map((label) => label.labelName));
  const [showAnyCategory, setShowAnyCategory] = useState<boolean>(true);
  const [showAnyType, setShowAnyType] = useState<boolean>(true);
  const [importanceMin, setImportanceMin] = useState<number>(1);
  const [importanceMax, setImportanceMax] = useState<number>(10);

  const filterData = { sortType, startDate, endDate, type, category, importanceMin, importanceMax, showAnyCategory, wasReset, oldestNoteDate, showAnyType, allTypes, allCategories };
  const filterDataSetters = { setSortType, setStartDate, setEndDate, setType, setCategory, setImportanceMin, setImportanceMax, setShowAnyCategory, setShowAnyType };
  const debouncedSearchTerm: string = useDebounce(searchQuery, 500);
  const debouncedSortType = useDebounce(sortType, 500);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);
  const debouncedShowAnyCategory = useDebounce(showAnyCategory, 500);
  const debouncedShowAnyType = useDebounce(showAnyType, 500);
  const debouncedType: string[] = useDebounce(type, 500);
  const debouncedCategory: string[] = useDebounce(category, 500);
  const debouncedImportanceMin = useDebounce(importanceMin, 500);
  const debouncedImportanceMax = useDebounce(importanceMax, 500);

  const sort = useCallback(
    (notes: INote[]) => {
      const sortedNotes = notes.sort((x, y) => {
        switch (sortType) {
          case SortOptions.NEWEST:
            return y.startDate - x.startDate;
          case SortOptions.OLDEST:
            return x.startDate - y.startDate;

          case SortOptions.IMPORTANCE:
            return y.rating - x.rating;

          case SortOptions.TYPE:
            if (!y.type) return 0;

            return y.type?.labelName.localeCompare(x.type?.labelName ?? '');

          case SortOptions.CATEGORY:
            const xCategory = x.category;
            const yCategory = y.category;
            if (xCategory && yCategory) {
              return yCategory?.length - xCategory?.length;
            } else if (xCategory) {
              return -1;
            } else {
              return 1;
            }
          case SortOptions.CONTENT:
            return getContentWords(y.content || '') - getContentWords(x.content || '');

          case SortOptions.ALPHABETICAL:
            return x.title.localeCompare(y.title);

          default:
            return y.startDate - x.startDate;
        }
      });

      return sortedNotes;
    },
    [sortType]);

  const filter = (notes: INote[]) => {
    const filteredNotes = notes.filter((note) => {
      const titleFilter = note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const typeFilter = showAnyType || (note.type && debouncedType.includes(note.type?.labelName));
      const categoryFilter = showAnyCategory ? true : note.category?.map((c) => c.labelName).some((r) => debouncedCategory.includes(r));
      const dateFilter = note.startDate >= debouncedStartDate && note.startDate <= getLastPeriodDate(-1, debouncedEndDate);
      const importanceFilter = note.rating >= importanceMin && note.rating <= importanceMax;

      return titleFilter && typeFilter && categoryFilter && importanceFilter && dateFilter;
    });

    return filteredNotes;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortType(SortOptions.NEWEST);
    setEndDate(new Date().getTime());
    setType([]);
    setCategory([]);
    setShowAnyType(true);
    setShowAnyCategory(true);
    setImportanceMin(1);
    setImportanceMax(10);

    setWasReset(!wasReset);
  };

  useEffect(() => {
    dispatch(fetchAllNotes({ user, filter, sort }));
  }, [
    debouncedSortType,
    debouncedStartDate,
    debouncedEndDate,
    debouncedType,
    debouncedCategory,
    debouncedImportanceMin,
    debouncedImportanceMax,
    debouncedSearchTerm,
    debouncedShowAnyCategory,
    debouncedShowAnyType
  ]);

  useEffect(() => {
    setStartDate(oldestNoteDate);
  }, [oldestNoteDate]);

  // Choosing new added type.
  useEffect(() => {
    if (!type.includes(allTypes.map((label) => label.labelName).at(-1) || '')) {
      setType((prev) => [...prev, allTypes.map((label) => label.labelName).at(-1) || '']);
    }
  }, [user.customNoteTypes]);

  // Choosing new added category.
  useEffect(() => {
    if (!category.includes(allCategories.map((label) => label.labelName).at(-1) || '')) {
      setCategory((prev) => [...prev, allCategories.map((label) => label.labelName).at(-1) || '']);
    }
  }, [user.customNoteCategories]);

  return (
    <div
      ref={filterBarRef}
      className={`w-full absolute top-0 z-[99] left-0 right-0 pb-4 pt-2 rounded-b-xl shadow-md duration-500 ease-in-out bg-white px-[3vw] ${isFilterBarShown ? '' : '-translate-y-[92%] max-h-36'
        }`}
    >
      <div className={`fl justify-between flex-wrap transition-all duration-300 ${isFilterBarShown ? 'delay-300' : 'opacity-0 invisible'}`}>
        {filterOptions.map((option) => {
          return <FilterOption setShowFullAddForm={setShowFullAddForm} option={option} key={option.name} filterData={filterData} filterDataSetters={filterDataSetters} />;
        })}
        <FilterSearchInput
          inputClassName="filter-search-input rounded-lg py-3 h-full min-w-[12rem] pr-8  hover:text-white focus-within:text-white focus-within:bg-cyan-600 hover:bg-cyan-600 focus-within:placeholder:text-white hover:placeholder:text-white"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="mx-3 mt-2"
        />
      </div>
      <span
        onClick={() => dispatch(setShowFilterBar(!isFilterBarShown))}
        className={`text-4xl absolute -bottom-7 text-cyan-600 z-50 cursor-pointer transition-all duration-300 block right-4 ${isFilterBarShown ? 'rotate-180' : ''} hover:text-cyan-700`}
      >
        <IoIosArrowDown />
      </span>
      <span
        onClick={resetFilters}
        className={`text-lg absolute -bottom-[22px] px-[6px] py-[1px] bg-cyan-500 text-white rounded-lg z-50 cursor-pointer transition-all duration-300 block right-16  hover:bg-cyan-600`}
      >
        Reset
      </span>
    </div>
  );
};

export default memo(FilterBar)
