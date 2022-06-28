import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import config from '../config/config';
import logging from '../config/logging';
import { setNotes } from '../features/journal/journalSlice';
import INote from '../interfaces/note';
import '../styles/note.scss';
import { getInitialNote } from '../utils/functions';
import InfoMessage from './InfoMessage';
import Loading from './Loading';
import NotePreview from './NotePreview';

const Notes = () => {
    const { notes } = useAppSelector((store) => store.journal);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
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
        return (
            <div className="flex justify-center items-center w-full h-full mt-20">
                <Loading scaleSize={2} />
            </div>
        );
    }

    return (
        <div className="notes padding-x pt-12">
            {notes.map((note, index) => {
                return <NotePreview note={note} key={note._id} previousNote={index === 0 ? null : notes[index - 1]} />;
            })}
            <InfoMessage message={error} isError={true} />
        </div>
    );
};

export default Notes;
