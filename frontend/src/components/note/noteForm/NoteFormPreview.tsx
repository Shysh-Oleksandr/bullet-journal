import React from 'react';
import INote from '../../../interfaces/note';
import NoteBody from '../NoteBody';

interface NoteFormPreviewProps {
    isShort?: boolean;
    startDate: number;
    note: INote;
}

const NoteFormPreview = ({ isShort, startDate, note }: NoteFormPreviewProps) => {
    return (
        <div className="text-left mt-4">
            <h4 className="sm:text-2xl text-xl mb-1">Preview</h4>
            {isShort && (
                <div className="text-[#267491] text-xl">
                    <h4>{new Date(startDate).toDateString()}</h4>
                </div>
            )}
            <NoteBody className={isShort ? 'note__body my-8' : ''} note={note} />
        </div>
    );
};

export default NoteFormPreview;
