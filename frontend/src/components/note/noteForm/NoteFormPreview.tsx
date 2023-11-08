import React from 'react';
import NoteBody from '../NoteBody';
import { Note } from '../../../features/journal/types';

interface NoteFormPreviewProps {
    isShort?: boolean;
    startDate: number;
    note: Note;
}

const NoteFormPreview = ({ isShort, startDate, note }: NoteFormPreviewProps) => {
    return (
        <div className="text-left mt-6">
            <h4 className="sm:text-2xl text-xl mb-2">Preview</h4>
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
