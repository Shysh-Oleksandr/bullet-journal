import axios from 'axios';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import React, { memo, useCallback, useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AiFillLock, AiFillStar, AiFillUnlock } from 'react-icons/ai';
import { BsDashLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { RiSave3Fill } from 'react-icons/ri';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import config from '../../../config/config';
import logging from '../../../config/logging';
import { fetchAllNotes, setError, setSuccess } from '../../../features/journal/journalSlice';
import ICustomLabel from '../../../interfaces/customLabel';
import INote from '../../../interfaces/note';
import { getContentWords } from '../../../utils/functions';
import DeleteModal from '../../UI/DeleteModal.';
import Loading from '../../UI/Loading';
import InputLabel from './InputLabel';
import NoteCategoryInput from './NoteCategoryInput';
import NoteContentEditor from './NoteContentEditor';
import NoteDate from './NoteDate';
import NoteFormPreview from './NoteFormPreview';
import NoteImportanceInput from './NoteImportanceInput';
import NoteSavingIndicator from './NoteSavingIndicator';
import NoteTypeInput from './NoteTypeInput';
import OtherNotes from './OtherNotes';
import SaveButton from './SaveButton';
import { useAppDispatch, useAppSelector } from '../../../store/helpers/storeHooks';
import { getUserData, getUserId } from '../../../features/user/userSlice';
import { useWindowSize } from '../../../hooks/useWindowSize';

interface NoteFormProps {
  isShort?: boolean;
  showFullAddForm?: boolean;
  setShowFullAddForm?: (value: React.SetStateAction<boolean>) => void;
}

const NoteForm = ({ isShort, showFullAddForm, setShowFullAddForm }: NoteFormProps) => {
  const [_id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date().getTime());
  const [endDate, setEndDate] = useState(new Date().getTime());
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [color, setColor] = useState('#04a9c6');
  const [rating, setRating] = useState(1);
  const [type, setType] = useState<ICustomLabel | null>(null);
  const [category, setCategory] = useState<ICustomLabel[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [prevNote, setPrevNote] = useState<INote | null>(null);
  const [nextNote, setNextNote] = useState<INote | null>(null);

  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState(0);

  const user = useAppSelector(getUserData);
  const userId = useAppSelector(getUserId) ?? '';
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
    setType(null);
    setCategory([]);
    setEditorState(EditorState.createEmpty());
    setIsLocked(false);
    setIsStarred(false);
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
      setPrevNote(_prevNote);
      setNextNote(_nextNote);
    }
  }, [notes, _id]);

  useEffect(() => {
    setWords(content.trim() === '<p></p>' || content === '' ? 0 : getContentWords(content));
  }, [content]);

  const getNote = useCallback(
    async (id: string) => {
      try {
        const response = await axios({
          method: 'GET',
          url: `${config.server.url}/notes/read/${id}`
        });

        if (response.status === 200 || response.status === 304) {
          if (userId !== response.data.note.author) {
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
            setType(note.type ?? null);
            setCategory(note.category || []);
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
    },
    [dispatch, userId],
  );

  const saveNote = async (method: string, url: string, isCreating: boolean, showMessage: boolean = true) => {
    const _startDate = new Date(startDate);

    const _endDate = new Date(endDate);
    _startDate.setHours(0, 0, 0, 0);
    _endDate.setHours(0, 0, 0, 0);
    if (title === '' || color === '' || !startDate || !endDate) {
      showMessage && dispatch(setError('Please fill out all required fields.'));
      showMessage && dispatch(setSuccess(''));
      return null;
    } else if (_startDate.getTime() > _endDate.getTime()) {
      showMessage && dispatch(setError('End date cannot be earlier than start date.'));
      return null;
    }

    showMessage && dispatch(setError(''));
    showMessage && dispatch(setSuccess(''));
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
          rating: rating > 0 && rating <= 10 ? rating : 1,
          content,
          type: type?._id,
          category: category.map(item => item._id),
          isLocked,
          isStarred,
          author: userId
        }
      });

      if (response.status === 201 && user) {
        if (isShort) {
          dispatch(fetchAllNotes({ user }));
          resetState();
        } else {
          setId(response.data.note._id);
          _id === '' && navigate(`/edit/${response.data.note._id}`);
        }
        showMessage && dispatch(setSuccess(`Note ${isCreating ? 'added' : 'updated'}.`));
      } else {
        showMessage && dispatch(setError('Unable to save note.'));
      }
    } catch (error: any) {
      showMessage && dispatch(setError(error.message));
    } finally {
      setTimeout(() => {
        setSaving(false);
      }, 500);
    }
  };

  const createNote = async () => await saveNote('POST', `${config.server.url}/notes/create`, true);
  const editNote = async (showMessage: boolean = true) => await saveNote('PATCH', `${config.server.url}/notes/update/${_id}`, false, showMessage);

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
    if (isLocked) return;
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
      className={`transition-all duration-500 ${isShort ? '' : `${isSidebarShown && width > 1024 ? 'small-padding-x' : 'padding-x'} sm:pb-12 pb-8`} ${isShort && !showFullAddForm ? 'max-h-16 overflow-hidden mb-4' : 'max-h-[300rem]'
        }`}
    >
      <form
        onClick={() => setShowFullAddForm && setShowFullAddForm(true)}
        className={`bg-white rounded-sm shadow-xl ${isShort ? 'pb-4 pt-2 px-8' : 'md:pt-3 sm:pt-2 pt-[6px] md:pb-6 sm:pb-4 pb-3 md:mt-12 sm:mt-8 mt-6 xlg:px-10 lg:px-4 md:px-10 sm:px-6 px-4'
          }`}
      >
        <div className="fl border-bottom relative z-10">
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
            disabled={saving || isLocked}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`font-medium w-full flex-1 sm:pr-20 pr-12 text-cyan-900 resize-none overflow-hidden ${isShort ? 'py-2 text-2xl' : 'md:py-4 sm:py-3 py-[6px] md:text-3xl sm:text-2xl text-xl'
              }`}
            required={true}
          />
          {!isShort && _id !== '' && <NoteSavingIndicator saving={saving} />}
        </div>
        <div className="fl lg:flex-row flex-col border-bottom-lg-show mb-6">
          <div className="fl xs:h-11 border-bottom-lg lg:w-auto w-full lg:justify-start xs:justify-between justify-center xs:flex-row flex-col lg:border-r-2 xlg:pr-4">
            <NoteDate disabled={saving || isLocked} date={startDate} isStartDate={true} setDate={setStartDate} inputClassname="border-bottom-xs w-full fl justify-center" />
            <BsDashLg className="xlg:mx-6 lg:mx-1 mx-3 xs:block hidden xs:text-4xl text-xl" />
            <NoteDate disabled={saving || isLocked} date={endDate} isStartDate={false} setDate={setEndDate} inputClassname="xs:mt-0 mt-3" />
          </div>
          <div className="fl border-bottom-lg lg:mt-0 mt-5 w-full justify-between lg:px-0 xs:px-4">
            <div className="xlg:mx-4 lg:mx-1 sm:ml-2 mr-4 flex-shrink-0 text-lg text-cyan-600 whitespace-nowrap">{words} words</div>
            <div className="fl custom-border lg:border-l-2 xlg:pl-8 lg:pl-1">
              <div className="relative fl xlg:mr-3 mr-1 h-11">
                <NoteImportanceInput disabled={saving || isLocked} importance={rating} setImportance={setRating} inputId="noteRatingInput" />
                <label htmlFor="noteRatingInput" className="cursor-pointer text-3xl px-1 text-[#6aaac2] py-2">
                  /10
                </label>
                <InputLabel htmlFor="noteRatingInput" text="Importance" />
              </div>
              <div className="relative fl h-11">
                <label style={{ color: color }} htmlFor="noteColorInput" className="cursor-pointer text-3xl xlg:px-4 lg:px-1 px-3 text-[#6aaac2] py-2">
                  <IoIosColorPalette />
                </label>
                <input
                  type="color"
                  id="noteColorInput"
                  className="hidden"
                  disabled={saving || isLocked}
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                  }}
                />
                <InputLabel htmlFor="noteColorInput" text="Color" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-between border-bottom my-3">
          <div className="relative sm:mr-4 mr-2 sm:basis-auto basis-1/2">
            <NoteTypeInput disabled={saving || isLocked} setNoteColor={setColor} label={type} setLabel={setType} />
            <InputLabel htmlFor="noteTypeInput" text="Type" />
          </div>
          <div className="relative sm:basis-3/4 basis-1/2">
            <NoteCategoryInput disabled={saving || isLocked} setNoteColor={setColor} label={category} setLabel={setCategory} />
            <InputLabel htmlFor="noteCategoryInput" text="Categories" />
          </div>
        </div>
        <NoteContentEditor disabled={isLocked} setEditorState={setEditorState} setContent={setContent} setImage={setImage} editorState={editorState} isShort={isShort} />
        <div>
          <SaveButton
            className={`bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 ${isShort ? 'mt-2 py-2' : 'mt-4'}`}
            onclick={(e) => {
              e.preventDefault();
              _id !== '' ? editNote() : createNote();
            }}
            disabled={saving || isLocked}
            type="submit"
            icon={<RiSave3Fill className="mr-2" />}
            text={_id !== '' ? 'Update' : 'Create'}
          />
          {_id !== '' && (
            <SaveButton
              className="bg-red-600 hover:bg-red-700 mt-2 disabled:bg-red-900"
              onclick={() => setModal(true)}
              disabled={saving || isLocked}
              type="button"
              icon={<MdDelete className="mr-2" />}
              text="Delete"
            />
          )}
        </div>
        {!isShort && _id && (prevNote || nextNote) && <OtherNotes prevNote={prevNote} nextNote={nextNote} />}
      </form>
      <NoteFormPreview isShort={isShort} startDate={startDate} note={{ _id, title, startDate, endDate, content, image, color, rating, category, type, isStarred, author: '' }} />
      {_id !== '' && modal && <DeleteModal deleteNote={deleteNote} deleting={deleting} modal={modal} setModal={setModal} />}
    </div>
  );
};

export default memo(NoteForm);
