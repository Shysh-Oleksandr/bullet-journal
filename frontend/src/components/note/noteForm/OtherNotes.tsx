import React from 'react';
import INote from '../../../interfaces/note';
import OtherNoteBtn from './OtherNoteBtn';

interface OtherNotesProps {
    prevNote: INote | null;
    nextNote: INote | null;
}
const OtherNotes = ({ prevNote, nextNote }: OtherNotesProps) => {
    return (
        <div className="flex-between py-2 custom-border border-t-2 mt-4">
            <OtherNoteBtn isPrev={true} otherNote={prevNote} />
            <div className="sm:h-14 h-12 w-[1.5px] shrink-0 rounded-md bg-cyan-400 block"></div>
            <OtherNoteBtn isPrev={false} otherNote={nextNote} />
        </div>
    );
};

export default OtherNotes;
