import { memo, useState } from 'react';
import { Note } from '../../features/journal/types';
import { getDifferentColor } from '../../utils/functions';
import NoteBody from './NoteBody';

interface INotePreviewProps {
  note: Note;
  previousNoteStartDate: number | null;
}

const NotePreview = ({ note, previousNoteStartDate }: INotePreviewProps) => {
  const [hover, setHover] = useState(false);

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
        bgColor={hover ? getDifferentColor(note.color, 5) : note.color}
        titleClassName='hover:underline'
        className={`cursor-pointer note__body sm:mt-8 mt-6`}
        note={note}
      />
    </div>
  );
};

export default memo(NotePreview);
