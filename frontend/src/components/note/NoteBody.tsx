import React from 'react';
import INote from '../../interfaces/note';
import { SEPARATOR } from '../../utils/data';
import { getDifferentColor, sanitizedData } from '../../utils/functions';
import NoteInfo from './NoteInfo';

interface NoteBodyProps {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    bgColor?: string;
    titleClassName?: string;
    contentClassName?: string;
    className?: string;
    note: INote;
    showImage?: boolean;
}

const NoteBody = ({ onMouseEnter, onMouseLeave, onClick, bgColor, titleClassName, className, contentClassName, note, showImage }: NoteBodyProps) => {
    const noteCategories = note.category?.split(SEPARATOR);

    return (
        <div
            className={`rounded-lg shadow-md py-4 px-8 transition-colors flex-between ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{ backgroundColor: bgColor || note.color, color: getDifferentColor(note.color, 185) }}
        >
            <div className="w-full">
                <h3 className={`text-3xl font-bold mb-1 cursor-auto ${titleClassName}`}>{note.title}</h3>

                {note.content && (
                    <div dangerouslySetInnerHTML={{ __html: sanitizedData(note.content) }} className={`px-2 break-words overflow-y-auto !leading-6 max-h-32 h-auto ${contentClassName}`}></div>
                )}
                <div className="mt-2 text-lg ">
                    <NoteInfo text={`${note.rating}/10`} color={note.color} className="tracking-widest" />
                    <NoteInfo text={note.type} color={note.color} />
                    {noteCategories?.map((category) => {
                        if (category.trim() === '') return null;
                        return <NoteInfo text={category} key={category} color={note.color} />;
                    })}
                </div>
            </div>
            {note.image && showImage && <div className="w-64 h-24 note__image rounded-md ml-4" style={{ backgroundImage: `url(${note.image})` }}></div>}
        </div>
    );
};

export default NoteBody;
