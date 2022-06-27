import axios from 'axios';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BiCalendarAlt } from 'react-icons/bi';
import { BsDashLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import config from '../config/config';
import { NoteTypes } from '../interfaces/note';
import logging from './../config/logging';
import INote from './../interfaces/note';
import Alert from './Alert';
import Loading from './Loading';
import { getDifferentColor } from './../utils/functions';

const NoteForm = () => {
    const [_id, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<number>(new Date().getTime());
    const [endDate, setEndDate] = useState<number>(new Date().getTime());
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

    const colorRef = useRef() as RefObject<HTMLLabelElement>;

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
                setError('Unable to retrieve note ' + id);
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
        <div className="padding-x">
            <form className="px-10 pt-3 pb-4 bg-white rounded-sm shadow-2xl my-12">
                <div className="flex justify-between items-center">
                    <input disabled={saving} type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="border-bottom py-4 text-3xl w-full" required={true} />
                </div>
                <div className="flex items-center justify-between border-bottom mb-3">
                    <div className="flex items-center h-11">
                        <div className="relative ">
                            <div className="flex items-center">
                                <label htmlFor="startDateInput" className="cursor-pointer text-2xl">
                                    <BiCalendarAlt />
                                </label>
                                <input
                                    type="date"
                                    id="startDateInput"
                                    onChange={(e) => setStartDate(new Date(e.target.value).getTime())}
                                    className="pl-2 py-3 cursor-pointer"
                                    value={new Date(startDate!).toLocaleDateString('en-CA')}
                                />
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
                                <input
                                    type="date"
                                    id="endDateInput"
                                    onChange={(e) => setEndDate(new Date(e.target.value).getTime())}
                                    className="pl-2 py-3 cursor-pointer"
                                    value={new Date(endDate!).toLocaleDateString('en-CA')}
                                />
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
                                className="w-16 text-xl bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] px-2 py-1 rounded-sm text-[#6aaac2]"
                                defaultValue={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            />
                            <label htmlFor="noteRatingInput" className="cursor-pointer text-3xl px-1 text-[#6aaac2] py-2">
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
                        editorClassName="h-[60vh] cursor-text border-cyan-100 border-2 rounded-sm border-solid px-3"
                        onEditorStateChange={(newState) => {
                            setEditorState(newState);
                            setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
                        }}
                        toolbar={{
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
                        className="text-2xl font-bold px-8 py-3 rounded-md bg-cyan-600 text-white cursor-pointer shadow-md transition-all hover:bg-cyan-700 hover:shadow-lg w-full mt-4"
                    >
                        {_id !== '' ? 'Update' : 'Create'}
                    </button>
                    {_id !== '' && (
                        <Link
                            to={`/notes/${_id}`}
                            className="text-2xl font-bold px-8 py-3 rounded-md shadow-md bg-cyan-900 text-white cursor-pointer transition-all hover:bg-cyan-800 hover:shadow-lg w-full mt-2 block"
                        >
                            View this note
                        </Link>
                    )}
                </div>
                <div className="text-left mt-4">
                    <h4 className="text-2xl mb-1">Preview</h4>
                    <div style={{ backgroundColor: color, color: getDifferentColor(color, 185) }} className="rounded-md px-4 py-3 shadow-md">
                        <h2 className="text-3xl font-bold mb-2 break-words">{title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: content }} className="px-2 !leading-6 break-words overflow-y-auto max-h-[60vh]"></div>
                    </div>
                </div>
            </form>
            <Alert message={error} isError={true} />
            <Alert message={success} isError={false} />
        </div>
    );
};

export default NoteForm;
