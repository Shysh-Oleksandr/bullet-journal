import React, { useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import NoteSidebarPreview from './NoteSidebarPreview';
import { useAppDispatch } from './../../app/hooks';
import { fetchAllNotes } from '../../features/journal/journalSlice';

const Sidebar = () => {
    const { notes } = useAppSelector((store) => store.journal);
    const { user } = useAppSelector((store) => store.user);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllNotes(user));
    }, []);

    return (
        <div className="h-full absolute top-0 left-0 z-50 w-[10rem] bg-cyan-900 overflow-x-hidden pt-4 text-white text-xl">
            <button className="text-2xl text-right">
                <IoMdMenu />
            </button>

            <div>
                {notes.map((note) => {
                    return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
                })}
            </div>
        </div>
    );
};

export default Sidebar;
