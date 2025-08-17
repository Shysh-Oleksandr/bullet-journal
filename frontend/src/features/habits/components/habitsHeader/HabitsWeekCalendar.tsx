import { addDays, format, isSameDay, isToday, startOfToday } from 'date-fns';
import React, { useCallback, useMemo } from 'react';

import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { Habit } from '../../types';

import { useHabitsWeekDates } from '../../hooks/useHabitsWeekDates';

import WeekCalendarItem from './WeekCalendarItem';
import Typography from '../../../../components/Typography';
import theme from '../../../../theme';

const today = startOfToday().getTime();

type Props = {
    selectedDate: number;
    activeHabits: Habit[];
    setSelectedDate: (val: number) => void;
};

const HabitsWeekCalendar = ({ selectedDate, activeHabits, setSelectedDate }: Props): JSX.Element => {
    const isTodaySelected = useMemo(() => isToday(selectedDate), [selectedDate]);

    const mappedWeekDates = useHabitsWeekDates(selectedDate, activeHabits);

    const onArrowPress = useCallback(
      (isRightArrow = false) => {
        const newDate = addDays(selectedDate, isRightArrow ? 1 : -1).getTime();
  
        setSelectedDate(newDate);
      },
      [selectedDate, setSelectedDate],
    );
  

    return (
        <div className="mb-5 w-full">
            <div className="flex justify-between items-center">
                <div>
                    <button
                        className={`flex items-center ${isTodaySelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                        disabled={isTodaySelected}
                        onClick={() => setSelectedDate(today)}
                    >
                        <Typography className="flex items-center" fontSize="xxl" color={isTodaySelected ? theme.colors.blackText : theme.colors.gray} fontWeight="bold">
                            Today
                            {` `}
                            {!isTodaySelected && <MdArrowForward color="#06b6d4" className="ml-1" size={20} />}
                        </Typography>
                    </button>
                    <Typography fontSize="sm" fontWeight="semibold" className="text-left block" paddingTop={2} color="#0891b2">
                        {format(selectedDate, 'dd MMM yyyy')}
                    </Typography>
                </div>
                <div className='flex items-center gap-2 '>
                    <div className='cursor-pointer hover:opacity-80' onClick={() => onArrowPress(false)}>
                        <MdArrowBack color={theme.colors.cyan500} size={theme.fontSizes.xxxl} />
                    </div>
                    <div className='cursor-pointer hover:opacity-80' onClick={() => !isTodaySelected && onArrowPress(true)}>
                        <MdArrowForward color={isTodaySelected ? theme.colors.gray : theme.colors.cyan500} size={theme.fontSizes.xxxl} />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-between mt-3">
                {mappedWeekDates.map(({ date, percentageCompleted }) => (
                    <WeekCalendarItem key={date} date={date} percentageCompleted={percentageCompleted} isActive={isSameDay(date, selectedDate)} setSelectedDate={setSelectedDate} />
                ))}
            </div>
        </div>
    );
};

export default React.memo(HabitsWeekCalendar);
