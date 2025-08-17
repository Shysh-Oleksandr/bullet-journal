import React, { forwardRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ItemCircularProgressProps {
    inputValue: string;
    color: string;
    isCheckType: boolean;
    isCompleted: boolean;
    percentageCompleted?: number;
    handleUpdate?: () => void;
    onChange?: (text: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const ItemCircularProgress = forwardRef<HTMLInputElement, ItemCircularProgressProps>(
    ({ inputValue, color, isCheckType, isCompleted, percentageCompleted = 0, handleUpdate, onChange, inputRef }, ref) => {
        const size = 48;
        const strokeWidth = 5;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (Math.min(Math.max(percentageCompleted ?? 0, 0), 100) / 100) * circumference;

        if (isCheckType) {
            return (
                <button
                    className="relative w-12 h-12 rounded-full border-[5px] border-solid transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                        borderColor: isCompleted ? color : '#e5e7eb',
                        backgroundColor: isCompleted ? color : 'transparent'
                    }}
                    onClick={handleUpdate}
                >
                    {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </button>
            );
        }

        return (
            <div className="relative w-12 h-12">
                <svg
                    className="w-12 h-12 transform -rotate-90 rounded-full"
                    viewBox={`0 0 ${size} ${size}`}
                    style={{
                        backgroundColor: isCompleted ? color : 'transparent'
                    }}
                >
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <input
                        ref={inputRef || ref}
                        type="text"
                        value={inputValue}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-8 h-8 text-center text-sm font-semibold bg-transparent border-none outline-none"
                        style={{ color: isCompleted ? '#fff' : color }}
                        onBlur={handleUpdate}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleUpdate?.();
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
);

ItemCircularProgress.displayName = 'ItemCircularProgress';

export default ItemCircularProgress;
