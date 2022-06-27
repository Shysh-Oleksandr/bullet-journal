import axios from 'axios';
import { EditorState } from 'draft-js';
import { default as React, RefObject, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import INote from '../interfaces/note';
import IPageProps from './../interfaces/page';
import config from './../config/config';
import Loading from '../components/Loading';
import DeleteModal from './../components/UI/DeleteModal.';

const NotePage = (props: IPageProps) => {
    const [_id, setId] = useState<string>('');
    const [note, setNote] = useState<INote | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [deleting, setDeleting] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(true);
    const { user } = useAppSelector((store) => store.user);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let noteID = params.noteID;

        if (noteID) {
            setId(noteID);
        } else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (_id !== '') {
            getNote();
        }
    }, [_id]);

    const getNote = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes/${_id}`
            });

            if (response.status === 200 || response.status === 304) {
                setNote(response.data.note);
            } else {
                setError('Unable to retrieve note ' + _id);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNote = async () => {
        setDeleting(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${config.server.url}/notes/${_id}`
            });

            if (response.status === 201) {
                navigate('/');
            } else {
                setError('Unable to retrieve note ' + _id);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full mt-20">
                <Loading scaleSize={2} />
            </div>
        );
    }

    if (note) {
        return <div>{modal && <DeleteModal deleteNote={deleteNote} deleting={deleting} error={error} modal={modal} setModal={setModal} />}</div>;
    } else {
        return <Navigate to={'/'} />;
    }
};

export default NotePage;
