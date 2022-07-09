import React from 'react';
import { INITIAL_NOTE_ID } from '../../utils/functions';
import INote from './../../interfaces/note';
import { useNavigate, useParams } from 'react-router-dom';
import NoteInfo from './../note/NoteInfo';

interface NoteSidebarPreviewProps {
    note: INote;
}

const NoteSidebarPreview = ({ note }: NoteSidebarPreviewProps) => {
    const isInitialNote: boolean = note._id === INITIAL_NOTE_ID;
    const navigate = useNavigate();
    const params = useParams();
    const currentNoteOpenedId = params.noteID;

    return (
        <div
            onClick={() => !isInitialNote && navigate(`/edit/${note._id}`)}
            className={`sm:pt-2 pt-1 sm:pb-1 pb-[2px] px-4 ${
                currentNoteOpenedId === note._id ? '!bg-cyan-700' : 'bg-cyan-800'
            } my-[2px] transition-all duration-200 hover:bg-cyan-900 text-left w-full ${isInitialNote ? '' : 'cursor-pointer'}`}
        >
            <h4 className="text-lg whitespace-nowrap overflow-hidden text-ellipsis">{note.title}</h4>
            <div className="flex-between">
                <h5 className="text-sm text-cyan-500">{new Date(note.startDate).toDateString()}</h5>
                <NoteInfo text={note.type} color="#0e7490" className="!text-base mr-0 !py-[1px] !px-[6px]" />
            </div>
        </div>
    );
};

export default NoteSidebarPreview;
