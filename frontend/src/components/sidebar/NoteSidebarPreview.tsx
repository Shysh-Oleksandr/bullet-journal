import { AiFillStar } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { setShowSidebar } from '../../features/journal/journalSlice';
import INote from './../../interfaces/note';
import NoteInfo from './../note/NoteInfo';
import { useAppDispatch } from '../../store/helpers/storeHooks';
import { useWindowSize } from '../../hooks/useWindowSize';

interface NoteSidebarPreviewProps {
    note: INote;
}

const NoteSidebarPreview = ({ note }: NoteSidebarPreviewProps) => {
    const navigate = useNavigate();
    const params = useParams();
    const currentNoteOpenedId = params.noteID;
    const dispatch = useAppDispatch();
    const [width] = useWindowSize();

    return (
        <div
            onClick={() => {
                navigate(`/edit/${note._id}`);
                width < 1024 && dispatch(setShowSidebar(false));
            }}
            className={`sm:pt-2 pt-1 sm:pb-1 pb-[2px] px-4 ${
                currentNoteOpenedId === note._id ? '!bg-cyan-700' : 'bg-cyan-800'
            } my-[2px] transition-all duration-200 hover:bg-cyan-900 text-left w-full cursor-pointer`}
        >
            <h4 className="text-lg whitespace-nowrap overflow-hidden text-ellipsis">{note.title}</h4>
            <div className="flex-between">
                <h5 className="text-sm text-cyan-500">{new Date(note.startDate).toDateString()}</h5>
                <div>
                    {note.isStarred && <NoteInfo className="!text-base !py-[1px] !px-[6px] mr-1" text={<AiFillStar className="text-[1.3rem] inline-block pb-1" />} color="#0e7490" />}
                   {note.type &&  <NoteInfo text={note.type.labelName} color="#0e7490" className="!text-base mr-0 !py-[1px] !px-[6px]" />}
                </div>
            </div>
        </div>
    );
};

export default NoteSidebarPreview;
