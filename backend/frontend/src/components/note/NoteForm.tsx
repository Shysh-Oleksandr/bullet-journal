import axios from 'axios';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BsDashLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { RiSave3Fill } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import config from '../../config/config';
import logging from '../../config/logging';
import INote, { NoteTypes } from '../../interfaces/note';
import Alert from '../UI/Alert';
import DeleteModal from '../UI/DeleteModal.';
import Loading from '../UI/Loading';
import NoteBody from './NoteBody';
import NoteDate from './NoteDate';
import SaveButton from './SaveButton';

const NoteForm = () => {
    const [_id, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<number>(new Date().getTime());
    const [endDate, setEndDate] = useState<number>(new Date().getTime());
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [color, setColor] = useState<string>('#04a9c6');
    const [rating, setRating] = useState<number>(1);
    const [type, setType] = useState<string | NoteTypes>(NoteTypes.NOTE);
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

    const [modal, setModal] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { user } = useAppSelector((store) => store.user);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let noteID = params.noteID;

        // If it's edit page, get note by id.
        if (noteID) {
            setId(noteID);
            getNote(noteID);
        }
        // Otherwise, have the blank form.
        else {
            setIsLoading(false);
        }
    }, []);

    const getNote = async (id: string) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes/read/${id}`
            });

            if (response.status === 200 || response.status === 304) {
                if (user._id !== response.data.note.author._id) {
                    logging.warn('This note is owned by someone else');
                    setId('');
                } else {
                    let note = response.data.note as INote;

                    setTitle(note.title);
                    setStartDate(note.startDate);
                    setEndDate(note.endDate);
                    setContent(note.content || '');
                    setImage(note.image || '');
                    setColor(note.color);
                    setRating(note.rating);
                    setType(note.type);

                    const contentBlock = htmlToDraft(note.content || '');
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const _editorState = EditorState.createWithContent(contentState);

                    setEditorState(_editorState);
                }
            } else {
                setError('Unable to retrieve note ' + id);
                setId('');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const saveNote = async (method: string, url: string, isCreating: boolean) => {
        if (title === '' || type === '' || color === '' || !startDate || !endDate) {
            setError('Please fill out all required fields.');
            setSuccess('');
            return null;
        }

        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const response = await axios({
                method: method,
                url: url,
                data: {
                    title,
                    startDate,
                    endDate,
                    image,
                    color,
                    rating,
                    content,
                    type,
                    author: user._id
                }
            });

            if (response.status === 201) {
                setId(response.data.note._id);
                setSuccess(`Note ${isCreating ? 'added' : 'updated'}.`);
            } else {
                setError('Unable to save note.');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const createNote = async () => await saveNote('POST', `${config.server.url}/notes/create`, true);
    const editNote = async () => await saveNote('PATCH', `${config.server.url}/notes/update/${_id}`, false);

    const deleteNote = async () => {
        setDeleting(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${config.server.url}/notes/${_id}`
            });

            if (response.status === 200) {
                setTimeout(() => {
                    navigate('/');
                }, 500);
            } else {
                setError('Unable to delete note ' + _id);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setTimeout(() => {
                setDeleting(false);
            }, 500);
        }
    };

    if (isLoading) {
        return <Loading scaleSize={2} className="mt-20" />;
    }

    return (
        <div className="padding-x mb-12">
            <form className="px-10 pt-3 pb-6 bg-white rounded-sm shadow-xl mt-12">
                <div className="flex-between">
                    <input disabled={saving} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border-bottom py-4 text-3xl w-full" required={true} />
                </div>
                <div className="flex-between border-bottom mb-3">
                    <div className="fl h-11">
                        <NoteDate date={startDate} isStartDate={true} setDate={setStartDate} />
                        <BsDashLg className="mx-6 text-xl" />
                        <NoteDate date={endDate} isStartDate={false} setDate={setEndDate} />
                    </div>
                    <div className="fl">
                        <div className="relative fl mr-3 h-11">
                            <input
                                type="number"
                                min={1}
                                max={10}
                                id="noteRatingInput"
                                className="w-16 text-xl bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] px-2 py-1 rounded-sm text-[#6aaac2]"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            />
                            <label htmlFor="noteRatingInput" className="cursor-pointer text-3xl px-1 text-[#6aaac2] py-2">
                                /10
                            </label>

                            <label htmlFor="noteRatingInput" className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ">
                                Importance
                            </label>
                        </div>
                        <div className="relative fl h-11">
                            <label style={{ color: color }} htmlFor="noteColorInput" className="cursor-pointer text-3xl px-4 text-[#6aaac2] py-2">
                                <IoIosColorPalette />
                            </label>
                            <input
                                type="color"
                                id="noteColorInput"
                                className="hidden"
                                value={color}
                                onChange={(e) => {
                                    setColor(e.target.value);
                                }}
                            />
                            <label htmlFor="noteColorInput" className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ">
                                Color
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <Editor
                        placeholder="Write your note here..."
                        editorState={editorState}
                        toolbarClassName="toolbarClassName border-cyan-100 border-2 rounded-sm"
                        wrapperClassName="mt-8"
                        editorClassName="h-[60vh] cursor-text border-cyan-100 transition-all border-2 rounded-sm border-solid focus-within:border-[3px] focus-within:border-cyan-200 px-3"
                        onEditorStateChange={(newState) => {
                            const newContent = draftToHtml(convertToRaw(newState.getCurrentContent()));
                            setEditorState(newState);
                            setContent(newContent);

                            const regex = /(?<=src=")(.*)(?=" alt)/g;
                            const images = newContent.match(regex);

                            images && setImage(images[0]);
                        }}
                    />
                </div>
                <div>
                    <SaveButton
                        className="bg-cyan-600 hover:bg-cyan-700 mt-4"
                        onclick={(e) => {
                            e.preventDefault();
                            _id !== '' ? editNote() : createNote();
                        }}
                        disabled={saving}
                        type="submit"
                        icon={<RiSave3Fill className="mr-2" />}
                        text={_id !== '' ? 'Update' : 'Create'}
                    />
                    {_id !== '' && (
                        <SaveButton className="bg-red-600 hover:bg-red-700 mt-2" onclick={() => setModal(true)} disabled={false} type="button" icon={<MdDelete className="mr-2" />} text="Delete" />
                    )}
                </div>
            </form>
            <div className="text-left mt-4">
                <h4 className="text-2xl mb-1">Preview</h4>
                <NoteBody note={{ _id, title, startDate, endDate, content, image, color, rating, type, author: '' }} />
            </div>
            {_id !== '' && modal && <DeleteModal deleteNote={deleteNote} deleting={deleting} error={error} modal={modal} setModal={setModal} />}
            <Alert message={error} isError={true} />
            <Alert message={success} isError={false} />
        </div>
    );
};

export default NoteForm;
