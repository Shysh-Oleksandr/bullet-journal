import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

interface NoteSavingIndicatorProps {
    isSaving: boolean;
}

const NoteSavingIndicator = ({ isSaving }: NoteSavingIndicatorProps) => {
    return (
        <div className="absolute right-0 bottom-3 italic text-lg fl text-cyan-900">
            {isSaving ? (
                'Saving...'
            ) : (
                <>
                    <span className="text-[1.75rem] text-green-600">
                        <IoMdCheckmark />
                    </span>
                    Saved
                </>
            )}
        </div>
    );
};

export default NoteSavingIndicator;
