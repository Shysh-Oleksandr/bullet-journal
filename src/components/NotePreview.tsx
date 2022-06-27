import React from 'react';
import { Link } from 'react-router-dom';
import INote from '../interfaces/note';

interface INotePreviewProps {
    note: INote;
}

const NotePreview = ({ note }: INotePreviewProps) => {
    return (
        <div className="note mb-8 text-left text-white" key={note._id}>
            <div className="note__date text-xl">
                <h4>{new Date(note.startDate).toDateString()}</h4>
            </div>
            <div className="rounded-md shadow-md mt-8 py-4 px-8 flex justify-between items-center" style={{ backgroundColor: note.color }}>
                <div>
                    <Link to={`/notes/${note._id}`} className="text-3xl font-bold mb-1 block">
                        {note.title}
                    </Link>
                    <div dangerouslySetInnerHTML={{ __html: note.content || '' }} className="px-2 w-full break-words overflow-y-auto max-h-[60px]"></div>
                    <h4 className="mt-2 text-xl">{note.type}</h4>
                </div>
                {note.image && <div className="w-64 h-24 note__image rounded-md ml-4" style={{ backgroundImage: `url(${note.image})` }}></div>}
            </div>
        </div>
    );
};

export default NotePreview;
