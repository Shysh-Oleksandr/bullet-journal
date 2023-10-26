import React, { MutableRefObject, useRef } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from './../components/Navbar';
import Pagination from './../components/pagination/Pagination';
import { useAppSelector } from '../store/helpers/storeHooks';
import { useWindowSize } from '../hooks/useWindowSize';

const HomePage = () => {
  const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
  const topRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { notes, isSidebarShown } = useAppSelector((store) => store.journal);
  const [width] = useWindowSize();

  return (
    <div>
      <Sidebar sidebarRef={sidebarRef} />
      <div style={{ marginLeft: isSidebarShown && width > 1024 ? (sidebarRef.current ? sidebarRef.current.offsetWidth : 336) : 0 }} className="transition-all duration-500 ease-in-out md:pb-12 pb-8">
        <div ref={topRef} className="top"></div>
        <Navbar topRef={topRef} />
        <Pagination items={notes} topRef={topRef} />
      </div>
    </div>
  );
};

export default HomePage;
