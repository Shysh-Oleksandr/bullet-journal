import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { fetchAllNotes, setError } from '../../features/journal/journalSlice';
import { useDebounce } from '../../hooks';
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
    const { user } = useAppSelector((store) => store.user);
    const { notes } = useAppSelector((store) => store.journal);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchTerm = useDebounce(searchQuery, 600);
    const isEditPage = window.location.pathname.includes('edit');

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllNotes(user));
        filterNotes(debouncedSearchTerm);
    }, []);

    useEffect(() => {
        filterNotes(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const filterNotes = async (title: string) => {
        setIsSearching(true);

        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes/query/${user._id}?title=${title}`
            });

            if (response.status === 200 || response.status === 304) {
                let notes = response.data.notes as INote[];
                title === '' && notes.push(getInitialNote(user));
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
            <Link to={'/'} className="text-3xl h-[65px] font-semibold px-4 flex items-center break-all bg-cyan-900 hover:text-cyan-100 transition-colors">
                {user.name.split(' ')[0]}'s Journal
            </Link>
            <div className="relative flex-between bg-cyan-800">
                <div className="relative">
                    <input
                        type="text"
                        className="mx-4 w-full text-lg text-cyan-800 shadow-lg my-3 rounded-2xl pl-9 pr-3 py-1 border-solid transition-all border-cyan-500 focus:border-b-[3px] hover:bg-cyan-50"
                        placeholder="Search note"
                        value={searchQuery}
                        id="seach-query-input"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <label htmlFor="seach-query-input" className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-cyan-800">
                        <AiOutlineSearch />
                    </label>
                    <label
                        htmlFor="seach-query-input"
                        onClick={() => setSearchQuery('')}
                        className={`filter-search-delete text-2xl absolute right-0 top-1/2 rotate-45 text-cyan-600 -translate-y-1/2 transition-all cursor-pointer duration-[250ms] ${
                            searchQuery.length > 0 ? 'opacity-100' : 'opacity-0 invisible'
                        }`}
                    >
                        {<BsPlusLg />}
                    </label>
                </div>
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
                ) : isEditPage || debouncedSearchTerm !== '' ? (
                    filteredNotes.map((note) => {
                        return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
                    })
                ) : (
                    notes.map((note) => {
                        return note.isEndNote ? null : <NoteSidebarPreview note={note} key={note._id} />;
                    })
                )}
            </div>
        </div>
    );
};

export default Sidebar;
