import React from 'react';
import { BiCalendarAlt } from 'react-icons/bi';
import InputLabel from './InputLabel';

interface NoteDateProps {
    date: number;
    setDate: (value: React.SetStateAction<number>) => void;
    isStartDate: boolean;
    inputClassname?: string;
}

const NoteDate = ({ date, setDate, isStartDate, inputClassname }: NoteDateProps) => {
    return (
        <div className="relative">
            <div className={`flex items-center ${inputClassname}`}>
                <label htmlFor={`${isStartDate ? 'start' : 'end'}DateInput`} className="cursor-pointer text-2xl">
                    <BiCalendarAlt />
                </label>
                <input
                    type="date"
                    id={`${isStartDate ? 'start' : 'end'}DateInput`}
                    onChange={(e) => setDate(new Date(e.target.value).getTime())}
                    className={`pl-2 py-3 cursor-pointer`}
                    value={new Date(date).toLocaleDateString('en-CA')}
                />
            </div>

            <InputLabel htmlFor={`${isStartDate ? 'start' : 'end'}DateInput`} text={isStartDate ? 'Start' : 'End'} />
        </div>
    );
};

export default NoteDate;
