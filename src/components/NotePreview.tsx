import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import INote from '../interfaces/note';
import { getDifferentColor, sanitizedData } from '../utils/functions';

interface INotePreviewProps {
    note: INote;
    previousNote: INote | null;
}

const NotePreview = ({ note, previousNote }: INotePreviewProps) => {
    const [hover, setHover] = useState<boolean>(false);
    const navigate = useNavigate();

    const isInitialNote: boolean = note._id === '111';

    const isTheSameDate: boolean = new Date(note.startDate).toDateString() === new Date(previousNote?.startDate || 1).toDateString();

    return (
        <div className="note mb-8 text-left text-white" key={note._id}>
            {!isTheSameDate && (
                <div className="text-[#267491] text-xl">
                    <h4>{new Date(note.startDate).toDateString()}</h4>
                </div>
            )}
            <div
                className={`note__body rounded-lg shadow-md mt-8 py-4 px-8 transition-colors flex justify-between items-center ${isInitialNote ? 'cursor-auto' : 'cursor-pointer'}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => !isInitialNote && navigate(`/edit/${note._id}`)}
                style={{ backgroundColor: hover ? getDifferentColor(note.color, -10) : note.color, color: getDifferentColor(note.color, 185) }}
            >
                <div className="w-full">
                    <button className={`text-3xl font-bold mb-1 cursor-auto ${isInitialNote ? '' : 'hover:underline !cursor-pointer'}`}>{note.title}</button>

                    {note.content && <div dangerouslySetInnerHTML={{ __html: sanitizedData(note.content) }} className="px-2 break-words overflow-y-auto  max-h-[75px] !leading-6 h-auto"></div>}
                    <div className="mt-2 text-lg ">
                        <h4 className="mr-2 px-2 py-1 inline-block rounded-md tracking-widest" style={{ backgroundColor: getDifferentColor(note.color, 20) }}>
                            {note.rating}/10
                        </h4>
                        <h4 className="px-2 py-1 inline-block rounded-md" style={{ backgroundColor: getDifferentColor(note.color, 20) }}>
                            {note.type}
                        </h4>
                    </div>
                </div>
                {note.image && <div className="w-64 h-24 note__image rounded-md ml-4" style={{ backgroundImage: `url(${note.image})` }}></div>}
            </div>
        </div>
    );
};

export default NotePreview;
