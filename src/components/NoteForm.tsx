import React, { RefObject, useEffect, useId, useRef, useState } from 'react';
import { BiCalendarAlt } from 'react-icons/bi';
import { BsDashLg } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';
import { IoIosColorPalette } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { NoteTypes } from '../interfaces/note';
import { useAppSelector } from '../app/hooks';
import axios from 'axios';
import config from '../config/config';
import INote from './../interfaces/note';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import Loading from './Loading';
import logging from './../config/logging';
import Alert from './Alert';

const NoteForm = () => {
    const [_id, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<number>();
    const [endDate, setEndDate] = useState<number>();
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [color, setColor] = useState<string>('#6aaac2');
    const [rating, setRating] = useState<number>(1);
    const [type, setType] = useState<string | NoteTypes>(NoteTypes.NOTE);
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

    const [saving, setSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { user } = useAppSelector((store) => store.user);
    const params = useParams();

    const nameRef = useRef() as RefObject<HTMLInputElement>;
    const colorRef = useRef() as RefObject<HTMLLabelElement>;
    const navigate = useNavigate();

    // const onEditorStateChange = (editorState: EditorState) => {
    //   setEditorState(editorState);
    // };

    useEffect(() => {
        let noteID = params.noteID;

        if (noteID) {
            setId(noteID);
            getNote(noteID);
        } else {
            setIsLoading(false);
        }
    }, []);

    const getNote = async (id: string) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/notes/read${id}`
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
                setError('Unable to retrieve note' + id);
                setId('');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createNote = async () => {
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
                method: 'POST',
                url: `${config.server.url}/notes/create`,
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
                setSuccess('Note added.');
            } else {
                setError('Unable to save note.');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };
    const editNote = async () => {
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
                method: 'PATCH',
                url: `${config.server.url}/notes/update/${_id}`,
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
                setSuccess('Note updated.');
            } else {
                setError('Unable to save note.');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSaving(false);
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
        <div>
            <form className="px-10 pt-3 pb-4 bg-white rounded-sm shadow-2xl mx-32 my-12">
                <div className="flex justify-between items-center">
                    <input disabled={saving} tabIndex={0} type="text" placeholder="Title" ref={nameRef} className="border-bottom py-4 text-3xl w-full" required={true} />
                </div>
                <div className="flex items-center justify-between border-bottom mb-3">
                    <div className="flex items-center h-11">
                        <div className="relative ">
                            <div className="flex items-center">
                                <label htmlFor="startDateInput" className="cursor-pointer text-2xl">
                                    <BiCalendarAlt />
                                </label>
                                <input type="date" id="startDateInput" className="pl-2 py-3 cursor-pointer" defaultValue={new Date().toLocaleDateString('en-CA')} />
                            </div>
                            <label htmlFor="startDateInput" className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ">
                                Start
                            </label>
                        </div>
                        <span className="mx-8 text-xl">
                            <BsDashLg />
                        </span>
                        <div className="relative">
                            <div className="flex items-center">
                                <label htmlFor="endDateInput" className="cursor-pointer text-2xl">
                                    <BiCalendarAlt />
                                </label>
                                <input type="date" id="endDateInput" className="pl-2 py-3 cursor-pointer" defaultValue={new Date().toLocaleDateString('en-CA')} />
                            </div>
                            <label htmlFor="endDateInput" className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ">
                                End
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative flex items-center mr-3 h-11">
                            <input
                                type="number"
                                min={1}
                                max={10}
                                id="noteRatingInput"
                                className="w-16 text-xl bg-slate-300 px-2 py-1 rounded-sm"
                                defaultValue={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            />
                            <label ref={colorRef} htmlFor="noteRatingInput" className="cursor-pointer text-3xl px-1 text-[#6aaac2] py-2">
                                /10
                            </label>

                            <label htmlFor="noteRatingInput" className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 ">
                                Importance
                            </label>
                        </div>
                        <div className="relative flex items-center h-11">
                            <label ref={colorRef} htmlFor="noteColorInput" className="cursor-pointer text-3xl px-4 text-[#6aaac2] py-2">
                                <IoIosColorPalette />
                            </label>
                            <input
                                type="color"
                                id="noteColorInput"
                                className="hidden"
                                defaultValue={'#6aaac2'}
                                onChange={(e) => {
                                    colorRef.current!.style.color = e.target.value;
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
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="mt-8"
                        editorClassName="h-[60vh] cursor-text"
                        onEditorStateChange={(newState) => {
                            setEditorState(newState);
                            setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
                        }}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true }
                        }}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            _id !== '' ? editNote() : createNote();
                        }}
                        disabled={saving}
                        className="text-2xl font-bold px-8 py-3 rounded-md bg-cyan-600 text-white cursor-pointer transition-all hover:bg-cyan-700 hover:shadow-md w-full mt-4"
                    >
                        {_id !== '' ? 'Update' : 'Create'}
                    </button>
                    {_id !== '' && (
                        <Link
                            to={`/notes/${_id}`}
                            className="text-2xl font-bold px-8 py-3 rounded-md bg-cyan-900 text-white cursor-pointer transition-all hover:bg-cyan-800 hover:shadow-md w-full mt-2 block"
                        >
                            View this note
                        </Link>
                    )}
                </div>
                <div className="text-left mt-4">
                    <h4 className="text-2xl">Preview</h4>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
            </form>
            <Alert message={error} isError={true} />
            <Alert message={success} isError={false} />
        </div>
    );
};

export default NoteForm;
