import React, { MutableRefObject, useRef } from 'react';
import Notes from '../components/note/Notes';
import Navbar from './../components/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import { useAppSelector } from '../app/hooks';

const HomePage = () => {
    const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
    const { user } = useAppSelector((store) => store.user);

    return (
        <div>
            <Sidebar sidebarRef={sidebarRef} />
            <div style={{ marginLeft: user.isSidebarShown ? (sidebarRef.current ? sidebarRef.current.offsetWidth : 336) : 0 }} className="transition-all duration-500 ease-in-out">
                <Navbar />
                <Notes />
            </div>
        </div>
    );
};

export default HomePage;
