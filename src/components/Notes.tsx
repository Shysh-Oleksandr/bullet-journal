import React from 'react';
import { useAppSelector } from '../app/hooks';
import '../styles/note.scss';

const Notes = () => {
    const { notes } = useAppSelector((store) => store.journal);
    return (
        <div className="notes px-32 pt-12">
            {notes.map((note) => {
                return (
                    <div className="note mb-8 text-left" style={{ color: note.color }} key={note.id}>
                        <div className="note__date text-xl">
                            <h4>{new Date(note.startDate).toDateString()}</h4>
                        </div>
                        <div className="note__content rounded-md shadow-md mt-8 py-4 px-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{note.title}</h2>
                                <p className="text-xl">{note.description}</p>
                                <h4 className="mt-2 text-xl">{note.type}</h4>
                            </div>
                            {note.image && <div className="w-64 h-24 note__image rounded-md ml-4" style={{ backgroundImage: `url(${note.image})` }}></div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Notes;
