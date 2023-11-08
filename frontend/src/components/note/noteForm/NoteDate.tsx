import React from 'react';
import { BiCalendarAlt } from 'react-icons/bi';
import InputLabel from './InputLabel';

interface NoteDateProps {
  date: number | null;
  setDate: (value: React.SetStateAction<any>) => void;
  isStartDate: boolean;
  disabled?: boolean;
  inputClassname?: string;
  refToClick?: React.MutableRefObject<HTMLDivElement>;
}

const NoteDate = ({ date, setDate, isStartDate, inputClassname, refToClick, disabled }: NoteDateProps) => {
  if (!date) return null;

  return (
    <div className="relative w-full fl justify-center">
      <div className={`flex items-center ${inputClassname}`}>
        <label htmlFor={`${isStartDate ? 'start' : 'end'}DateInput`} className="cursor-pointer text-2xl">
          <BiCalendarAlt />
        </label>
        <input
          type="date"
          disabled={disabled === undefined ? false : disabled}
          id={`${isStartDate ? 'start' : 'end'}DateInput`}
          onChange={(e) => {
            setDate(new Date(e.target.value).getTime());
            setTimeout(() => {
              refToClick?.current.click();
            }, 0);
          }}
          className={`pl-2 py-3 cursor-pointer`}
          value={new Date(date).toLocaleDateString('en-CA')}
        />
      </div>

      <InputLabel htmlFor={`${isStartDate ? 'start' : 'end'}DateInput`} text={isStartDate ? 'Start' : 'End'} />
    </div>
  );
};

export default NoteDate;
