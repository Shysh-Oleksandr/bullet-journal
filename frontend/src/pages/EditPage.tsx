import React, { MutableRefObject, useRef } from 'react';
import Navbar from '../components/Navbar';
import NoteForm from '../components/note/noteForm/NoteForm';
import Sidebar from '../components/sidebar/Sidebar';
import { useAppSelector } from '../store/helpers/storeHooks';
import { useWindowSize } from '../hooks/useWindowSize';
import { getIsSidebarShown } from '../features/journal/journalSlice';

const EditPage = () => {
  const isSidebarShown = useAppSelector(getIsSidebarShown);

  const [width] = useWindowSize();

  const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;

  return (
    <div>
      <Sidebar sidebarRef={sidebarRef} />
      <div style={{ marginLeft: isSidebarShown && width > 1024 ? (sidebarRef.current ? sidebarRef.current.offsetWidth : 336) : 0 }} className="transition-all duration-500 ease-in-out">
        <Navbar />
        <NoteForm />
      </div>
    </div>
  );
};

export default EditPage;
