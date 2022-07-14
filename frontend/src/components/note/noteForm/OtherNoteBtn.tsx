import React from 'react';
import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import INote from '../../../interfaces/note';

interface OtherNoteBtnProps {
    otherNote: INote | null;
    isPrev: boolean;
}

const OtherNoteBtn = ({ otherNote, isPrev }: OtherNoteBtnProps) => {
    if (otherNote) {
        return (
            <Link to={`/edit/${otherNote._id}`} className={`other-note-btn cursor-pointer basis-[49%] w-1/2 flex-grow-0 flex-shrink-0 ${isPrev ? 'text-left' : 'text-right'}`}>
                <h5 className={`font-semibold fl text-sm text-cyan-800 uppercase transition-colors mb-1 ${isPrev ? 'justify-start' : 'justify-end'}  -tracking-normal`}>
                    {isPrev && <AiOutlineDoubleLeft className="mr-1 h-full text-sm font-bold" />}
                    <span>{isPrev ? 'Previous' : 'Next'}</span>
                    {!isPrev && <AiOutlineDoubleRight className="ml-1 h-full text-sm font-bold" />}
                </h5>
                <h4 className={`sm:text-lg text-base ${isPrev ? 'mr-auto' : 'ml-auto'} transition-all duration-300 text-cyan-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[95%]`}>
                    {otherNote.title}
                </h4>
            </Link>
        );
    } else {
        return <div className="basis-[49%] w-1/2"></div>;
    }
};

export default OtherNoteBtn;
