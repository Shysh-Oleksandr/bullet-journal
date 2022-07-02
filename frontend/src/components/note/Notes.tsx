import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import '../../styles/note.scss';
import NotePreview from './NotePreview';
import { useAppDispatch } from '../../app/hooks';
import Loading from '../UI/Loading';
import InfoMessage from '../UI/InfoMessage';
import config from '../../config/config';
import INote from '../../interfaces/note';
import { getInitialNote } from '../../utils/functions';
import { setNotes } from '../../features/journal/journalSlice';
import logging from '../../config/logging';
import NoteForm from './NoteForm';
import { BsPlusLg } from 'react-icons/bs';

const Notes = () => {
    const { notes } = useAppSelector((store) => store.journal);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showFullAddForm, setShowFullAddForm] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((store) => store.user);

    useEffect(() => {
        getAllNotes();
    }, []);

    const getAllNotes = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes/${user._id}`
            });

            if (response.status === 200 || response.status === 304) {
                let notes = response.data.notes as INote[];
                notes.push(getInitialNote(user));
                notes.sort((x, y) => y.startDate - x.startDate);
                dispatch(setNotes(notes));
            }
        } catch (error) {
            logging.error(error);
            setError('Unable to retreive notes.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading scaleSize={2} className="mt-20" />;
    }

    return (
        <div className="notes padding-x pt-12 relative">
            <button
                onClick={() => setShowFullAddForm(!showFullAddForm)}
                className={`${
                    showFullAddForm ? 'rotate-45 bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }  text-white p-2 transition-all duration-300 text-xl rounded-full absolute top-7 left-1/2 -translate-x-1/2`}
            >
                <BsPlusLg />
            </button>
            <NoteForm showFullAddForm={showFullAddForm} isShort={true} getAllNotes={getAllNotes} />{' '}
            {notes.map((note, index) => {
                return <NotePreview note={note} key={note._id} previousNote={index === 0 ? null : notes[index - 1]} />;
            })}
            <InfoMessage message={error} isError={true} />
        </div>
    );
};

export default Notes;
