import axios from 'axios';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AiFillLock, AiFillStar, AiFillUnlock } from 'react-icons/ai';
import { BsDashLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { RiSave3Fill } from 'react-icons/ri';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import config from '../../../config/config';
import logging from '../../../config/logging';
import { fetchAllNotes, setError, setSuccess } from '../../../features/journal/journalSlice';
import { useWindowSize } from '../../../hooks';
import INote from '../../../interfaces/note';
import { INITIAL_NOTE_ID } from '../../../utils/functions';
import DeleteModal from '../../UI/DeleteModal.';
import Loading from '../../UI/Loading';
import InputLabel from './InputLabel';
import NoteContentEditor from './NoteContentEditor';
import NoteDate from './NoteDate';
import NoteFormPreview from './NoteFormPreview';
import NoteImportanceInput from './NoteImportanceInput';
import NoteLabelInput from './NoteLabelInput';
import OtherNotes from './OtherNotes';
import SaveButton from './SaveButton';

interface NoteFormProps {
    isShort?: boolean;
    showFullAddForm?: boolean;
    setShowFullAddForm?: (value: React.SetStateAction<boolean>) => void;
}

const NoteForm = ({ isShort, showFullAddForm, setShowFullAddForm }: NoteFormProps) => {
    const [_id, setId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<number>(new Date().getTime());
    const [endDate, setEndDate] = useState<number>(new Date().getTime());
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [color, setColor] = useState<string>('#04a9c6');
    const [rating, setRating] = useState<number>(1);
    const [type, setType] = useState<string>('Note');
    const [category, setCategory] = useState<string>('');
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [isStarred, setIsStarred] = useState<boolean>(false);
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [prevNote, setPrevNote] = useState<INote | null>(null);
    const [nextNote, setNextNote] = useState<INote | null>(null);

    const [modal, setModal] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user } = useAppSelector((store) => store.user);
    const { notes, isSidebarShown } = useAppSelector((store) => store.journal);
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [width] = useWindowSize();

    const resetState = () => {
        setId('');
        setTitle('');
        setStartDate(new Date().getTime());
        setEndDate(new Date().getTime());
        setContent('');
        setImage('');
        setColor('#04a9c6');
        setRating(1);
        setType('Note');
        setCategory('');
        setEditorState(EditorState.createEmpty());
    };

    useEffect(() => {
        let noteID = params.noteID;

        if (noteID) {
            // If it's edit page, get note by id.
            setId(noteID);
            getNote(noteID);
        }
        // Otherwise, have the blank form.
        else {
            resetState();
            setIsLoading(false);
        }
    }, [location]);

    useEffect(() => {
        if (isShort) return;
        const filteredNotes = notes.filter((note) => !note.isEndNote);
        const currNoteIndex = filteredNotes.map((note) => note._id).indexOf(_id);
        if (currNoteIndex !== -1) {
            const _prevNote: INote | null = currNoteIndex - 1 >= 0 ? filteredNotes[currNoteIndex - 1] : null;
            const _nextNote: INote | null = currNoteIndex + 1 < filteredNotes.length ? filteredNotes[currNoteIndex + 1] : null;
            setPrevNote(_prevNote?._id === INITIAL_NOTE_ID ? null : _prevNote);
            setNextNote(_nextNote?._id === INITIAL_NOTE_ID ? null : _nextNote);
        }
    }, [notes, _id]);

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
                    setCategory(note.category || '');
                    setIsLocked(note.isLocked || false);
                    setIsStarred(note.isStarred || false);

                    const contentBlock = htmlToDraft(note.content || '');
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const _editorState = EditorState.createWithContent(contentState);

                    setEditorState(_editorState);
                }
            } else {
                dispatch(setError('Unable to retrieve note ' + id));
                setId('');
            }
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const saveNote = async (method: string, url: string, isCreating: boolean) => {
        const _startDate = new Date(startDate);
        const _endDate = new Date(endDate);
        _startDate.setHours(0, 0, 0, 0);
        _endDate.setHours(0, 0, 0, 0);
        if (title === '' || type === '' || color === '' || !startDate || !endDate) {
            dispatch(setError('Please fill out all required fields.'));
            dispatch(setSuccess(''));
            return null;
        } else if (_startDate.getTime() > _endDate.getTime()) {
            dispatch(setError('End date cannot be earlier than start date.'));
            return null;
        }

        dispatch(setError(''));
        dispatch(setSuccess(''));
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
                    category,
                    isLocked,
                    isStarred,
                    author: user._id
                }
            });

            if (response.status === 201) {
                if (isShort) {
                    dispatch(fetchAllNotes({ user }));
                    resetState();
                } else {
                    setId(response.data.note._id);
                    navigate(`/edit/${response.data.note._id}`);
                }
                dispatch(setSuccess(`Note ${isCreating ? 'added' : 'updated'}.`));
            } else {
                dispatch(setError('Unable to save note.'));
            }
        } catch (error: any) {
            dispatch(setError(error.message));
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
                    dispatch(setSuccess('Note has been deleted.'));
                    setDeleting(false);
                }, 500);
            } else {
                dispatch(setError('Unable to delete note.'));
                setDeleting(false);
            }
        } catch (error: any) {
            dispatch(setError(error.message));
            setDeleting(false);
        }
    };

    const handleStarredClick = () => {
        setIsStarred(!isStarred);
        dispatch(setSuccess(`Note was ${isStarred ? 'removed from' : 'added to'} the star list.`));
    };

    const handleLockedClick = () => {
        setIsLocked(!isLocked);
        dispatch(setSuccess(`Note was ${isLocked ? 'unlocked' : 'locked'}.`));
    };

    if (isLoading) {
        return (
            <div className={`transition-all duration-500 ${isShort ? '' : `${isSidebarShown && width > 1024 ? 'small-padding-x' : 'padding-x'} sm:pb-12 pb-8`}`}>
                <Loading scaleSize={2} className="mt-20" />
            </div>
        );
    }

    return (
        <div
            className={`transition-all duration-500 ${isShort ? '' : `${isSidebarShown && width > 1024 ? 'small-padding-x' : 'padding-x'} sm:pb-12 pb-8`} ${
                isShort && !showFullAddForm ? 'max-h-16 overflow-hidden mb-4' : 'max-h-[300rem]'
            }`}
        >
            <form
                onClick={() => setShowFullAddForm && setShowFullAddForm(true)}
                className={`bg-white rounded-sm shadow-xl ${isShort ? 'pb-4 pt-2 px-8' : 'md:pt-3 sm:pt-2 pt-[6px] md:pb-6 sm:pb-4 pb-3 md:mt-12 sm:mt-8 mt-6 md:px-10 sm:px-6 px-4'}`}
            >
                <div className="fl border-bottom">
                    {!isShort && _id !== '' && (
                        <div className="fl text-gray-400 text-3xl mr-3">
                            <span onClick={handleStarredClick} className={`cursor-pointer transition-colors hover:text-cyan-600 mr-1 ${isStarred ? 'text-cyan-500' : ''}`}>
                                <AiFillStar />
                            </span>
                            <span onClick={handleLockedClick} className={`cursor-pointer transition-colors hover:text-gray-600 ${isLocked ? 'text-gray-700' : ''}`}>
                                {isLocked ? <AiFillLock /> : <AiFillUnlock />}
                            </span>
                        </div>
                    )}
                    <TextareaAutosize
                        spellCheck={false}
                        maxRows={5}
                        disabled={saving}
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`font-medium w-full text-cyan-900 resize-none overflow-hidden ${isShort ? 'py-2 text-2xl' : 'md:py-4 sm:py-3 py-[6px] md:text-3xl sm:text-2xl text-xl'}`}
                        required={true}
                    />
                </div>
                <div className="flex-between md:flex-row flex-col border-bottom-md mb-6">
                    <div className="fl xs:h-11 border-bottom-sm md:w-auto w-full md:justify-start xs:justify-between justify-center xs:flex-row flex-col">
                        <NoteDate date={startDate} isStartDate={true} setDate={setStartDate} inputClassname="border-bottom-xs w-full fl justify-center" />
                        <BsDashLg className="lg:mx-6 mx-3 xs:block hidden xs:text-4xl text-xl" />
                        <NoteDate date={endDate} isStartDate={false} setDate={setEndDate} inputClassname="xs:mt-0 mt-3" />
                    </div>
                    <div className="fl border-bottom-sm md:mt-0 mt-5 md:w-auto w-full md:justify-start justify-between md:px-0 px-4">
                        <div className="relative fl lg:mr-3 mr-1 h-11">
                            <NoteImportanceInput importance={rating} setImportance={setRating} inputId="noteRatingInput" />
                            <label htmlFor="noteRatingInput" className="cursor-pointer text-3xl px-1 text-[#6aaac2] py-2">
                                /10
                            </label>
                            <InputLabel htmlFor="noteRatingInput" text="Importance" />
                        </div>
                        <div className="relative fl h-11">
                            <label style={{ color: color }} htmlFor="noteColorInput" className="cursor-pointer text-3xl lg:px-4 px-3 text-[#6aaac2] py-2">
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
                            <InputLabel htmlFor="noteColorInput" text="Color" />
                        </div>
                    </div>
                </div>
                <div className="flex-between border-bottom my-3">
                    <div className="relative sm:mr-4 mr-2 sm:basis-auto basis-1/2">
                        <NoteLabelInput setNoteColor={setColor} label={type} setLabel={setType} isCustomTypes={true} />
                        <InputLabel htmlFor="noteTypeInput" text="Type" />
                    </div>
                    <div className="relative sm:basis-3/4 basis-1/2">
                        <NoteLabelInput setNoteColor={setColor} label={category} setLabel={setCategory} isCustomTypes={false} />
                        <InputLabel htmlFor="noteCategoryInput" text="Categories" />
                    </div>
                </div>
                <NoteContentEditor setEditorState={setEditorState} setContent={setContent} setImage={setImage} editorState={editorState} isShort={isShort} />
                <div>
                    <SaveButton
                        className={`bg-cyan-600 hover:bg-cyan-700 ${isShort ? 'mt-2 py-2' : 'mt-4'}`}
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
                {!isShort && _id && <OtherNotes prevNote={prevNote} nextNote={nextNote} />}
            </form>
            <NoteFormPreview isShort={isShort} startDate={startDate} note={{ _id, title, startDate, endDate, content, image, color, rating, category, type, author: '' }} />
            {_id !== '' && modal && <DeleteModal deleteNote={deleteNote} deleting={deleting} modal={modal} setModal={setModal} />}
        </div>
    );
};

export default NoteForm;