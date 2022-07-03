import React, { MutableRefObject, useRef } from 'react';
import { useAppSelector } from '../app/hooks';
import Navbar from '../components/Navbar';
import NoteForm from '../components/note/NoteForm';
import Sidebar from '../components/sidebar/Sidebar';

const EditPage = () => {
    const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
    const { user } = useAppSelector((store) => store.user);

    return (
        <div className="fl">
            <Sidebar sidebarRef={sidebarRef} />
            <div style={{ marginLeft: user.isSidebarShown ? (sidebarRef.current ? sidebarRef.current.offsetWidth : 336) : 0 }} className="transition-all duration-500 ease-in-out">
                <Navbar />
                <NoteForm />
            </div>
        </div>
    );
};

export default EditPage;
