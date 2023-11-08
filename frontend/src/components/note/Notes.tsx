import { MutableRefObject, memo, useEffect, useRef, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import '../../styles/note.scss';
import Loading from '../UI/Loading';
import FilterBar from './../filterBar/FilterBar';
import NoteForm from './noteForm/NoteForm';
import NotePreview from './NotePreview';
import { useAppSelector } from '../../store/helpers/storeHooks';
import { useWindowSize } from '../../hooks/useWindowSize';
import { Note } from '../../features/journal/types';
import { getIsFilterBarShown, getIsSidebarShown } from '../../features/journal/journalSlice';

const withFilterBar = false;

interface NotesProps {
  notes: Note[];
}

const Notes = ({ notes }: NotesProps) => {
  const isSidebarShown = useAppSelector(getIsSidebarShown);
  const isFilterBarShown = useAppSelector(getIsFilterBarShown);

  const [width] = useWindowSize();

  const [showFullAddForm, setShowFullAddForm] = useState(false);

  const filterBarRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }, [isSidebarShown, isFilterBarShown]);

  return (
    <div
      style={{ paddingTop: isFilterBarShown && withFilterBar ? (filterBarRef.current ? filterBarRef.current.offsetHeight + 20 : 112) : 20 }}
      className={`notes ${isSidebarShown && width > 1024 ? 'small-padding-x' : 'padding-x'} transition-all duration-500 relative`}
    >
      {withFilterBar && <FilterBar filterBarRef={filterBarRef} setShowFullAddForm={setShowFullAddForm} />}

      <h5 className="sm:text-2xl text-xl text-left lg:mb-2 md:mb-3 mb-6 text-slate-500 font-semibold">Add a quick note</h5>
      <div className="relative">
        <button
          onClick={() => setShowFullAddForm(!showFullAddForm)}
          className={`${showFullAddForm ? 'rotate-45 bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }  text-white sm:p-2 p-[6px] transition-all shadow-md duration-300 z-30 sm:text-xl text-lg rounded-full absolute sm:-top-5 -top-4 left-1/2 -translate-x-1/2`}
        >
          <BsPlusLg />
        </button>
        <NoteForm showFullAddForm={showFullAddForm} setShowFullAddForm={setShowFullAddForm} isShort />
      </div>
      {false ? (
        <Loading scaleSize={2} className="my-20" />
      ) : (
        notes.map((note, index) => {
          return <NotePreview note={note} key={`${note._id}${note.isEndNote && 'endNote'}`} previousNoteStartDate={index === 0 ? null : notes[index - 1].startDate} />;
        })
      )}
    </div>
  );
};

export default memo(Notes);
