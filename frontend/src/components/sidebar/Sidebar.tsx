import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { fetchAllNotes } from '../../features/journal/journalSlice';
import { useAppDispatch } from './../../app/hooks';
import NoteSidebarPreview from './NoteSidebarPreview';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface SidebarProps {
    sidebarRef: React.MutableRefObject<HTMLDivElement>;
}

const Sidebar = ({ sidebarRef }: SidebarProps) => {
    const { notes } = useAppSelector((store) => store.journal);
    const { user } = useAppSelector((store) => store.user);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllNotes(user));
    }, []);

    return (
        <div
            ref={sidebarRef}
            className={`h-full absolute top-0 left-0 z-50 duration-500 ${
                user.isSidebarShown ? 'translate-x-0' : '-translate-x-full'
            } w-[24rem] transition-all ease-in-out bg-cyan-900 overflow-x-hidden text-white text-left text-xl`}
        >
            <h2 className="text-3xl h-[65px] font-semibold px-4 flex items-center break-all">{user.name.split(' ')[0]}'s Journal</h2>

            <div>
                <Link to={'/edit'} className="text-xl new-note py-5 px-4 bg-cyan-500 font-semibold mb-[2px] flex items-center cursor-pointer duration-300 transition-colors hover:bg-cyan-600">
                    <span className="mr-3 plus text-2xl transition-all duration-300">
                        <BsPlusLg />
                    </span>
                    New note
                </Link>
                {notes.map((note) => {
                    return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
                })}
            </div>
        </div>
    );
};

export default Sidebar;
