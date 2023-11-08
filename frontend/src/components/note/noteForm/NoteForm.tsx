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
import logging from '../../../config/logging';
import { notesApi } from '../../../features/journal/journalApi';
import { getIsSidebarShown, getNoteById, getNotes, setErrorMsg, setSuccessMsg } from '../../../features/journal/journalSlice';
import { CustomLabel, Note, UpdateNoteRequest } from '../../../features/journal/types';
import { getUserId } from '../../../features/user/userSlice';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useAppDispatch, useAppSelector } from '../../../store/helpers/storeHooks';
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

const DEFAULT_COLOR = '#04a9c6'

interface NoteFormProps {
  isShort?: boolean;
  showFullAddForm?: boolean;
  setShowFullAddForm?: (value: React.SetStateAction<boolean>) => void;
}

const NoteForm = ({ isShort, showFullAddForm, setShowFullAddForm }: NoteFormProps) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [width] = useWindowSize();

  const noteId = params.noteID;

  const noteData = useAppSelector(state => noteId ? getNoteById(state, noteId) : null);

  const [fetchNoteById, { isLoading: isNoteLoading }] =
    notesApi.useLazyFetchNoteByIdQuery();
  const [createNote] = notesApi.useCreateNoteMutation();
  const [updateNote] = notesApi.useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = notesApi.useDeleteNoteMutation();

  const userId = useAppSelector(getUserId) ?? '';
  const isSidebarShown = useAppSelector(getIsSidebarShown);
  const notes = useAppSelector(getNotes);

  const [currentNote, setCurrentNote] = useState<Note | null>(noteData ?? null)

  const [_id, setId] = useState(currentNote?._id ?? '');
  const [title, setTitle] = useState(currentNote?.title ?? '');
  const [startDate, setStartDate] = useState(currentNote?.startDate ?? new Date().getTime());
  const [endDate, setEndDate] = useState(currentNote?.endDate ?? new Date().getTime());
  const [content, setContent] = useState(currentNote?.content ?? '');
  const [image, setImage] = useState(currentNote?.image ?? '');
  const [color, setColor] = useState(currentNote?.color ?? DEFAULT_COLOR);
  const [rating, setRating] = useState(currentNote?.rating ?? 1);
  const [type, setType] = useState<CustomLabel | null>(currentNote?.type ?? null);
  const [category, setCategory] = useState<CustomLabel[]>(currentNote?.category ?? []);
  const [isLocked, setIsLocked] = useState(currentNote?.isLocked ?? false);
  const [isStarred, setIsStarred] = useState(currentNote?.isStarred ?? false);

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [prevNote, setPrevNote] = useState<Note | null>(null);
  const [nextNote, setNextNote] = useState<Note | null>(null);

  const [modal, setModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [words, setWords] = useState(0);

  const resetState = () => {
    setId('');
    setTitle('');
    setStartDate(new Date().getTime());
    setEndDate(new Date().getTime());
    setContent('');
    setImage('');
    setColor(DEFAULT_COLOR);
    setRating(1);
    setType(null);
    setCategory([]);
    setEditorState(EditorState.createEmpty());
    setIsLocked(false);
    setIsStarred(false);
  };

  const getNote = useCallback(
    async (id: string) => {
      try {
        const response = await fetchNoteById(id);

        let note = response.data?.note;

        if (!note) {
          const errorMsg = 'Unable to retrieve the note ' + id;
          dispatch(setErrorMsg(errorMsg));
          logging.error(errorMsg);

          return;
        }

        setCurrentNote(note);

        setId(note._id)
        setTitle(note.title);
        setStartDate(note.startDate);
        // setEndDate(note.endDate);
        setContent(note.content || '');
        setImage(note.image || '');
        setColor(note.color);
        setRating(note.rating);
        setType(note.type ?? null);
        setCategory(note.category ?? []);
        setIsLocked(!!note.isLocked);
        setIsStarred(!!note.isStarred);

        const contentBlock = htmlToDraft(note.content || '');
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const _editorState = EditorState.createWithContent(contentState);

        setEditorState(_editorState);
      } catch (error: any) {
        dispatch(setErrorMsg(error.message));
      }
    },
    [dispatch, fetchNoteById],
  );

  const saveNoteHandler = async (shouldLock?: boolean, withAlert = true) => {
    const isNewNote = !_id;

    if (!userId) {
      logging.error("The user doesn't have an id");

      return;
    }

    withAlert && dispatch(setErrorMsg(''));
    setIsSaving(true);

    const newNoteData: Note = {
      ...currentNote,
      _id: currentNote?._id ?? '',
      author: userId ?? "",
      title: title.trim(),
      content: content.trim(),
      color,
      startDate,
      rating,
      type,
      category,
      isStarred,
      isLocked,
    };

    const updateNoteData: UpdateNoteRequest = {
      ...newNoteData,
      title: newNoteData.title || "Note",
      type: type?._id ?? null,
      category: category.map(item => item._id),
      isLocked: shouldLock ?? newNoteData.isLocked,
    };

    try {
      if (isNewNote) {
        const noteId = (await createNote(updateNoteData).unwrap()).note._id;
        noteId && navigate(`/edit/${noteId}`);
      } else {
        await updateNote(updateNoteData);
      }

      withAlert && dispatch(setSuccessMsg(`The note is ${isNewNote ? "created" : "updated"}`));
    } catch (error) {
      logging.error(error);
      withAlert && dispatch(setErrorMsg('Unable to save note.'));
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  const deleteNoteHandler = async () => {
    try {
      await deleteNote(_id);

      dispatch(setSuccessMsg('Note has been deleted.'));
      navigate('/');
    } catch (error) {
      logging.error(error);
      dispatch(setErrorMsg('Unable to delete the note.'));
    }
  };

  const handleStarredClick = () => {
    if (isLocked) return;
    setIsStarred(!isStarred);
    dispatch(setSuccessMsg(`Note was ${isStarred ? 'removed from' : 'added to'} the star list.`));
  };

  const handleLockedClick = () => {
    setIsLocked(!isLocked);
    dispatch(setSuccessMsg(`Note was ${isLocked ? 'unlocked' : 'locked'}.`));
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
    }
  }, [getNote, location, params.noteID]);

  useEffect(() => {
    if (isShort) return;

    const filteredNotes = notes.filter((note) => !note.isEndNote);
    const currNoteIndex = filteredNotes.map((note) => note._id).indexOf(_id);

    if (currNoteIndex !== -1) {
      const _prevNote: Note | null = currNoteIndex - 1 >= 0 ? filteredNotes[currNoteIndex - 1] : null;
      const _nextNote: Note | null = currNoteIndex + 1 < filteredNotes.length ? filteredNotes[currNoteIndex + 1] : null;

      setPrevNote(_prevNote);
      setNextNote(_nextNote);
    }
  }, [notes, _id, isShort]);

  useEffect(() => {
    setWords(content.trim() === '<p></p>' || content === '' ? 0 : getContentWords(content));
  }, [content]);

  if (isNoteLoading) {
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
            disabled={isSaving || isLocked}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`font-medium w-full flex-1 sm:pr-20 pr-12 text-cyan-900 resize-none overflow-hidden ${isShort ? 'py-2 text-2xl' : 'md:py-4 sm:py-3 py-[6px] md:text-3xl sm:text-2xl text-xl'
              }`}
            required={true}
          />
          {!isShort && _id !== '' && <NoteSavingIndicator isSaving={isSaving} />}
        </div>
        <div className="fl lg:flex-row flex-col border-bottom-lg-show mb-6">
          <div className="fl xs:h-11 border-bottom-lg lg:w-auto w-full lg:justify-start xs:justify-between justify-center xs:flex-row flex-col lg:border-r-2 xlg:pr-4">
            <NoteDate disabled={isSaving || isLocked} date={startDate} isStartDate={true} setDate={setStartDate} inputClassname="border-bottom-xs w-full fl justify-center" />
            <BsDashLg className="xlg:mx-6 lg:mx-1 mx-3 xs:block hidden xs:text-4xl text-xl" />
            <NoteDate disabled={isSaving || isLocked} date={endDate} isStartDate={false} setDate={setEndDate} inputClassname="xs:mt-0 mt-3" />
          </div>
          <div className="fl border-bottom-lg lg:mt-0 mt-5 w-full justify-between lg:px-0 xs:px-4">
            <div className="xlg:mx-4 lg:mx-1 sm:ml-2 mr-4 flex-shrink-0 text-lg text-cyan-600 whitespace-nowrap">{words} words</div>
            <div className="fl custom-border lg:border-l-2 xlg:pl-8 lg:pl-1">
              <div className="relative fl xlg:mr-3 mr-1 h-11">
                <NoteImportanceInput disabled={isSaving || isLocked} importance={rating} setImportance={setRating} inputId="noteRatingInput" />
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
                  disabled={isSaving || isLocked}
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
            <NoteTypeInput disabled={isSaving || isLocked} setNoteColor={setColor} label={type} setLabel={setType} />
            <InputLabel htmlFor="noteTypeInput" text="Type" />
          </div>
          <div className="relative sm:basis-3/4 basis-1/2">
            <NoteCategoryInput disabled={isSaving || isLocked} setNoteColor={setColor} label={category} setLabel={setCategory} />
            <InputLabel htmlFor="noteCategoryInput" text="Categories" />
          </div>
        </div>
        <NoteContentEditor disabled={isLocked} setEditorState={setEditorState} setContent={setContent} setImage={setImage} editorState={editorState} isShort={isShort} />
        <div>
          <SaveButton
            className={`bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 ${isShort ? 'mt-2 py-2' : 'mt-4'}`}
            onclick={(e) => {
              e.preventDefault();
              saveNoteHandler();
            }}
            disabled={isSaving || isLocked}
            type="submit"
            icon={<RiSave3Fill className="mr-2" />}
            text={_id !== '' ? 'Update' : 'Create'}
          />
          {_id !== '' && (
            <SaveButton
              className="bg-red-600 hover:bg-red-700 mt-2 disabled:bg-red-900"
              onclick={() => setModal(true)}
              disabled={isSaving || isLocked}
              type="button"
              icon={<MdDelete className="mr-2" />}
              text="Delete"
            />
          )}
        </div>
        {!isShort && _id && (prevNote || nextNote) && <OtherNotes prevNote={prevNote} nextNote={nextNote} />}
      </form>
      <NoteFormPreview isShort={isShort} startDate={startDate} note={{ _id, title, startDate, endDate, content, image, color, rating, category, type, isStarred, author: '' }} />
      {_id !== '' && modal && <DeleteModal deleteNote={deleteNoteHandler} deleting={isDeleting} modal={modal} setModal={setModal} />}
    </div>
  );
};

export default memo(NoteForm);
