import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

interface NoteSavingIndicatorProps {
    saving: boolean;
}

const NoteSavingIndicator = ({ saving }: NoteSavingIndicatorProps) => {
    return (
        <div className="absolute right-0 bottom-3 italic text-lg fl text-cyan-900">
            {saving ? (
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
