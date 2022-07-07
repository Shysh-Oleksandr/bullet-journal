import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { useAppSelector } from '../../app/hooks';
import { useWindowSize } from '../../hooks';
import '../../styles/note.scss';
import InfoMessage from '../UI/InfoMessage';
import Loading from '../UI/Loading';
import FilterBar from './../filterBar/FilterBar';
import NoteForm from './NoteForm';
import NotePreview from './NotePreview';

const Notes = () => {
    const { notes, loading, error } = useAppSelector((store) => store.journal);
    const [showFullAddForm, setShowFullAddForm] = useState<boolean>(false);
    const { user } = useAppSelector((store) => store.user);
    const filterBarRef = useRef() as MutableRefObject<HTMLDivElement>;
    const [] = useWindowSize();

    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }, [user.isSidebarShown]);

    if (loading) {
        return <Loading scaleSize={2} className="mt-20" />;
    }

    return (
        <div
            style={{ paddingTop: user.isFilterBarShown ? (filterBarRef.current ? filterBarRef.current.offsetHeight + 15 : 112) : 25 }}
            className={`notes ${user.isSidebarShown ? 'small-padding-x' : 'padding-x'} transition-all duration-500 relative`}
        >
            <FilterBar filterBarRef={filterBarRef} />

            <h5 className="text-2xl text-left mb-2 text-slate-500 font-semibold">Add a quick note</h5>
            <div className="relative">
                <button
                    onClick={() => setShowFullAddForm(!showFullAddForm)}
                    className={`${
                        showFullAddForm ? 'rotate-45 bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    }  text-white p-2 transition-all shadow-md duration-300 z-30 text-xl rounded-full absolute -top-5 left-1/2 -translate-x-1/2`}
                >
                    <BsPlusLg />
                </button>
                <NoteForm showFullAddForm={showFullAddForm} setShowFullAddForm={setShowFullAddForm} isShort={true} />
            </div>
            {notes.map((note, index) => {
                return <NotePreview note={note} key={`${note._id}${note.isEndNote && 'endNote'}`} previousNote={index === 0 ? null : notes[index - 1]} />;
            })}
            <InfoMessage message={error} isError={true} />
        </div>
    );
};

export default Notes;
