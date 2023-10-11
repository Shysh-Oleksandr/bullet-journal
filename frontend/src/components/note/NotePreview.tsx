import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import INote from '../../interfaces/note';
import { getDifferentColor } from '../../utils/functions';
import NoteBody from './NoteBody';

interface INotePreviewProps {
  note: INote;
  previousNoteStartDate: number | null;
}

const NotePreview = ({ note, previousNoteStartDate }: INotePreviewProps) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const isTheSameDate = new Date(note.startDate).toDateString() === new Date(previousNoteStartDate || 1).toDateString();

  return (
    <div className="note sm:mb-8 mb-6 text-left text-white" key={note._id}>
      {!isTheSameDate && (
        <div className="text-[#267491] text-xl">
          <h4>{new Date(note.startDate).toDateString()}</h4>
        </div>
      )}
      <NoteBody
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate(`/edit/${note._id}`)}
        bgColor={hover ? getDifferentColor(note.color, -10) : note.color}
        titleClassName='hover:underline !cursor-pointer'
        className={`cursor-pointer note__body sm:mt-8 mt-6`}
        note={note}
        showImage={true}
        contentClassName={'max-h-[75px]'}
      />
    </div>
  );
};

export default memo(NotePreview);
