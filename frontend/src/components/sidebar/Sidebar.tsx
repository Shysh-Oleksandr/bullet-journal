import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { fetchAllNotes, setError } from '../../features/journal/journalSlice';
import useDebounce from '../../hooks';
import { getInitialNote } from '../../utils/functions';
import Loading from '../UI/Loading';
import { useAppDispatch } from './../../app/hooks';
import config from './../../config/config';
import INote from './../../interfaces/note';
import NoteSidebarPreview from './NoteSidebarPreview';

interface SidebarProps {
    sidebarRef: React.MutableRefObject<HTMLDivElement>;
}

const Sidebar = ({ sidebarRef }: SidebarProps) => {
    const { notes } = useAppSelector((store) => store.journal);
    const { user } = useAppSelector((store) => store.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchTerm = useDebounce(searchQuery, 600);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllNotes(user));
        filterNotes(debouncedSearchTerm);
    }, []);

    useEffect(() => {
        filterNotes(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const filterNotes = async (q: string) => {
        setIsSearching(true);
        console.log('filter');

        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes/query/${user._id}?q=${q}`
            });

            if (response.status === 200 || response.status === 304) {
                let notes = response.data.notes as INote[];
                q === '' && notes.push(getInitialNote(user));
                notes.sort((x, y) => y.startDate - x.startDate);
                setFilteredNotes(notes);
            }
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div
            ref={sidebarRef}
            className={`h-full absolute top-0 left-0 z-50 duration-500 ${
                user.isSidebarShown ? 'translate-x-0' : '-translate-x-full'
            } w-[24rem] transition-all ease-in-out bg-cyan-900 overflow-x-hidden text-white text-left text-xl`}
        >
            <h2 className="text-3xl h-[65px] font-semibold px-4 flex items-center break-all bg-cyan-900">{user.name.split(' ')[0]}'s Journal</h2>
            <div className="relative bg-cyan-800">
                <input
                    type="text"
                    className="w-2/3 mx-4 text-lg text-cyan-800 shadow-lg my-3 rounded-2xl pl-9 pr-3 py-1 border-solid transition-all border-cyan-500 focus:border-b-[3px] hover:bg-cyan-50"
                    placeholder="Search note"
                    value={searchQuery}
                    id="seach-query-input"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <label htmlFor="seach-query-input" className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-cyan-800">
                    <AiOutlineSearch />
                </label>
            </div>
            <div>
                <Link to={'/edit'} className="text-xl new-note py-5 px-4 bg-cyan-500 font-semibold mb-[2px] flex items-center cursor-pointer duration-300 transition-colors hover:bg-cyan-600">
                    <span className="mr-3 plus text-2xl transition-all duration-300">
                        <BsPlusLg />
                    </span>
                    New note
                </Link>
                {isSearching ? (
                    <Loading scaleSize={1.5} className="mt-20" />
                ) : (
                    filteredNotes.map((note) => {
                        return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
                    })
                )}
            </div>
        </div>
    );
};

export default Sidebar;
