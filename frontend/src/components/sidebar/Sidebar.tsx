import React, { memo, useCallback, useEffect, useState } from 'react';
import { BsPlusLg, BsStarFill } from 'react-icons/bs';
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { fetchAllNotes, setShowSidebar } from '../../features/journal/journalSlice';
import { useDebounce, useOnClickOutside, useWindowSize } from '../../hooks';
import FilterSearchInput from '../filterBar/FilterSearchInput';
import { useAppDispatch } from './../../app/hooks';
import NoteSidebarPreview from './NoteSidebarPreview';
import INote from './../../interfaces/note';

interface SidebarProps {
  sidebarRef: React.MutableRefObject<HTMLDivElement>;
}

const Sidebar = ({ sidebarRef }: SidebarProps) => {
  const { user } = useAppSelector((store) => store.user);
  const { notes, isSidebarShown } = useAppSelector((store) => store.journal);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 600);
  const isEditPage = window.location.pathname.includes('edit');
  const [width] = useWindowSize();
  const [starred, setStarred] = useState(false);

  useOnClickOutside(sidebarRef, () => width < 1024 && dispatch(setShowSidebar(false)));

  const dispatch = useAppDispatch();

  useEffect(() => {
    isEditPage && dispatch(fetchAllNotes({ user }));
  }, []);

  const filterStarredNotes = useCallback(
    (notes: INote[]) => {
      return starred ? notes.filter((note) => note.isStarred) : notes;
    },
    [starred],
  );

  return (
    <div
      ref={sidebarRef}
      className={`h-full fixed top-0 left-0 z-50 duration-500 ${isSidebarShown ? 'translate-x-0' : '-translate-x-full'
        } xs:w-[24rem] w-[100%] transition-all z-[2000] ease-in-out bg-cyan-900 overflow-x-hidden text-white text-left text-xl`}
    >
      <div className="fl sm:h-[65px] h-[50px] sticky top-0 left-0 bg-cyan-900 z-[200]">
        <button onClick={() => dispatch(setShowSidebar(!isSidebarShown))} className={`text-4xl transition-colors lg:hidden absolute left-4 top-1/2 -translate-y-1/2 hover:text-cyan-100`}>
          <IoMdMenu />
        </button>
        <Link
          to={'/'}
          onClick={() => {
            width < 1024 && dispatch(setShowSidebar(false));
          }}
          className="lg:text-3xl text-2xl lg:ml-0 ml-12 w-[24rem] whitespace-nowrap overflow-hidden text-ellipsis font-semibold px-4 block break-all bg-cyan-900 hover:text-cyan-100 transition-colors"
        >
          {user.name.split(' ')[0]}'s Journal
        </Link>
      </div>
      <div className="relative flex-between bg-cyan-800">
        <FilterSearchInput
          searchQuery={searchQuery}
          isSidebar={true}
          labelClassName="text-cyan-800 left-6 text-2xl"
          deleteClassName="text-cyan-800 !right-6"
          setSearchQuery={setSearchQuery}
          inputClassName="mx-4 text-cyan-800 shadow-lg my-3 rounded-2xl pl-9 pr-9 py-1 border-solid transition-all border-cyan-500 focus:border-b-[3px] hover:bg-cyan-50"
        />
      </div>
      <div>
        <Link
          to={'/edit'}
          onClick={() => width < 1024 && dispatch(setShowSidebar(false))}
          className="text-xl new-note py-5 px-4 bg-cyan-500 font-semibold flex items-center cursor-pointer duration-300 transition-colors hover:bg-cyan-600"
        >
          <span className="mr-3 plus text-2xl transition-all duration-300">
            <BsPlusLg />
          </span>
          New note
        </Link>
        <button
          onClick={() => setStarred(!starred)}
          className={`text-lg starred-btn py-5 px-4 w-full font-semibold flex items-center cursor-pointer duration-300 transition-colors hover:bg-cyan-800 ${starred ? '!bg-cyan-600' : 'bg-cyan-700'
            }`}
        >
          <span className="mr-3 star text-2xl transition-all duration-300">
            <BsStarFill />
          </span>
          View Starred Notes
        </button>
        {isEditPage || debouncedSearchTerm !== ''
          ? filterStarredNotes(notes)
            .filter((note) => note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            .map((note) => {
              return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
            })
          : filterStarredNotes(notes).map((note) => {
            return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
          })}
      </div>
    </div>
  );
};

export default memo(Sidebar);
