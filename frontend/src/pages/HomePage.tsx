import React, { MutableRefObject, useRef } from 'react';
import { useAppSelector } from '../app/hooks';
import Notes from '../components/note/Notes';
import Sidebar from '../components/sidebar/Sidebar';
import { useWindowSize } from '../hooks';
import Navbar from './../components/Navbar';

const HomePage = () => {
    const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
    const topRef = useRef() as MutableRefObject<HTMLDivElement>;
    const { isSidebarShown } = useAppSelector((store) => store.journal);
    const [width] = useWindowSize();

    return (
        <div>
            <Sidebar sidebarRef={sidebarRef} topRef={topRef} />
            <div style={{ marginLeft: isSidebarShown && width > 1024 ? (sidebarRef.current ? sidebarRef.current.offsetWidth : 336) : 0 }} className="transition-all duration-500 ease-in-out">
                <div ref={topRef} className="top"></div>
                <Navbar topRef={topRef} />
                <Notes />
            </div>
        </div>
    );
};

export default HomePage;
