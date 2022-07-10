import React, { MutableRefObject, useRef } from 'react';
import { useAppSelector } from '../app/hooks';
import Navbar from '../components/Navbar';
import NoteForm from '../components/note/NoteForm';
import Sidebar from '../components/sidebar/Sidebar';
import { useWindowSize } from '../hooks';

const EditPage = () => {
    const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
    const { isSidebarShown } = useAppSelector((store) => store.journal);
    const [width] = useWindowSize();

    return (
        <div className="fl">
            <Sidebar sidebarRef={sidebarRef} />
            <div style={{ marginLeft: isSidebarShown && width > 767 ? (sidebarRef.current ? sidebarRef.current.offsetWidth : 336) : 0 }} className="transition-all duration-500 ease-in-out">
                <Navbar />
                <NoteForm />
            </div>
        </div>
    );
};

export default EditPage;
