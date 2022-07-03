import React, { useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { useAppSelector } from '../../app/hooks';
import '../../styles/note.scss';
import InfoMessage from '../UI/InfoMessage';
import Loading from '../UI/Loading';
import NoteForm from './NoteForm';
import NotePreview from './NotePreview';

const Notes = () => {
    const { notes, loading, error } = useAppSelector((store) => store.journal);
    const [showFullAddForm, setShowFullAddForm] = useState<boolean>(false);

    if (loading) {
        return <Loading scaleSize={2} className="mt-20" />;
    }

    return (
        <div className="notes padding-x pt-12 relative">
            <h5 className="text-2xl text-left mb-2 text-slate-500 font-semibold">Add a quick note</h5>
            <button
                onClick={() => setShowFullAddForm(!showFullAddForm)}
                className={`${
                    showFullAddForm ? 'rotate-45 bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }  text-white p-2 transition-all shadow-md duration-300 z-30 text-xl rounded-full absolute top-[4.3rem] left-1/2 -translate-x-1/2`}
            >
                <BsPlusLg />
            </button>
            <NoteForm showFullAddForm={showFullAddForm} setShowFullAddForm={setShowFullAddForm} isShort={true} />
            {notes.map((note, index) => {
                return <NotePreview note={note} key={`${note._id}${note.isEndNote && 'endNote'}`} previousNote={index === 0 ? null : notes[index - 1]} />;
            })}
            <InfoMessage message={error} isError={true} />
        </div>
    );
};

export default Notes;
