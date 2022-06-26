import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import '../styles/note.scss';
import axios from 'axios';
import config from '../config/config';
import { setNotes } from '../features/journal/journalSlice';
import INote from '../interfaces/note';
import logging from '../config/logging';
import Loading from './Loading';
import NotePreview from './NotePreview';
import InfoMessage from './InfoMessage';

const Notes = () => {
    const { notes } = useAppSelector((store) => store.journal);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        GetAllNotes();
    }, []);

    const GetAllNotes = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes`
            });

            if (response.status === 200 || response.status === 304) {
                let notes = response.data.notes as INote[];
                notes.sort((x, y) => x.startDate - y.startDate);
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
        <div className="notes px-32 pt-12">
            {notes.map((note) => {
                return <NotePreview note={note} />;
            })}
            <InfoMessage message={error} isError={true} />
        </div>
    );
};

export default Notes;
