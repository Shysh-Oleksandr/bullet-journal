import React from 'react';
import { Link } from 'react-router-dom';
import INote from '../interfaces/note';
import { getDifferentColor, sanitizedData } from '../utils/functions';

interface INotePreviewProps {
    note: INote;
}

const NotePreview = ({ note }: INotePreviewProps) => {
    return (
        <div className="note mb-8 text-left text-white" key={note._id}>
            <div className="note__date text-xl">
                <h4>{new Date(note.startDate).toDateString()}</h4>
            </div>
            <div className="rounded-lg shadow-md mt-8 py-4 px-8 flex justify-between items-center" style={{ backgroundColor: note.color, color: getDifferentColor(note.color, 185) }}>
                <div className="w-full">
                    <Link to={`/edit/${note._id}`} className="text-3xl font-bold mb-1 block">
                        {note.title}
                    </Link>
                    {note.content && <div dangerouslySetInnerHTML={{ __html: sanitizedData(note.content) }} className="px-2 break-words overflow-y-auto  max-h-[75px] !leading-6 h-auto"></div>}
                    <h4 className="mt-2 text-lg px-2 py-1 inline-block rounded-md" style={{ backgroundColor: getDifferentColor(note.color, 20) }}>
                        {note.type}
                    </h4>
                    <h4 className="ml-2 mt-2 text-lg px-2 py-1 inline-block rounded-md tracking-widest" style={{ backgroundColor: getDifferentColor(note.color, 20) }}>
                        {note.rating}/10
                    </h4>
                </div>
                {note.image && <div className="w-64 h-24 note__image rounded-md ml-4" style={{ backgroundImage: `url(${note.image})` }}></div>}
            </div>
        </div>
    );
};

export default NotePreview;
