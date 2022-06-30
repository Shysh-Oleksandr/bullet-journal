import React from 'react';
import { BiCalendarAlt } from 'react-icons/bi';

interface NoteDateProps {
    date: number;
    setDate: (value: React.SetStateAction<number>) => void;
    isStartDate: boolean;
}

const NoteDate = ({ date, setDate, isStartDate }: NoteDateProps) => {
    return (
        <div className="relative">
            <div className="flex items-center">
                <label htmlFor={`${isStartDate ? 'start' : 'end'}DateInput`} className="cursor-pointer text-2xl">
                    <BiCalendarAlt />
                </label>
                <input
                    type="date"
                    id={`${isStartDate ? 'start' : 'end'}DateInput`}
                    onChange={(e) => setDate(new Date(e.target.value).getTime())}
                    className="pl-2 py-3 cursor-pointer"
                    value={new Date(date).toLocaleDateString('en-CA')}
                />
            </div>
            <label htmlFor={`${isStartDate ? 'start' : 'end'}DateInput`} className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ">
                {isStartDate ? 'Start' : 'End'}
            </label>
        </div>
    );
};

export default NoteDate;
