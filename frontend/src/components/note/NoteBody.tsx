import { useMemo } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Note } from '../../features/journal/types';
import { getDifferentColor, sanitizedData } from '../../utils/functions';
import { getTimeByDate } from '../../utils/getFormattedDate';
import { dateDiffInDays } from './../../utils/functions';
import NoteImages from './NoteImages';
import NoteImagesSlider from './NoteImagesSlider';
import NoteInfo from './NoteInfo';

const screenWidth = window.innerWidth;

interface NoteBodyProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  bgColor?: string;
  titleClassName?: string;
  contentClassName?: string;
  className?: string;
  note: Note;
}

const NoteBody = ({ onMouseEnter, onMouseLeave, bgColor, titleClassName, className, contentClassName, note }: NoteBodyProps) => {
  const noteTime = useMemo(() => note.endDate ? dateDiffInDays(new Date(note.startDate), new Date(note.endDate)) + 1 : 0, [note.endDate, note.startDate]);

  const { shouldDisplayTopSlider, shouldDisplaySideImages } = useMemo(() => {
    const imagesCount = note.images?.length;

    const shouldDisplayImages = !!imagesCount

    if (!shouldDisplayImages) return { shouldDisplayTopSlider: false, shouldDisplaySideImages: false }

    const shouldDisplayTopSlider = screenWidth < 600 || (screenWidth <= 768 && imagesCount > 1) || imagesCount > 2

    return {
      shouldDisplayTopSlider,
      shouldDisplaySideImages: !shouldDisplayTopSlider
    }
  }, [note.images?.length])


  return (
    <Link
      className={`note__preview relative rounded-[10px] overflow-hidden shadow-lg sm:pb-2 pb-1 ${shouldDisplayTopSlider ? "flex-col" : 'sm:pt-4 pt-3 sm:px-8 px-6'} transition-colors duration-300 flex-between ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      to={`/edit/${note._id}`}
      style={{ backgroundColor: bgColor || note.color, color: getDifferentColor(note.color, 185) }}
    >
      {shouldDisplayTopSlider && <NoteImagesSlider images={note.images} />}
      <div className={`w-full ${shouldDisplayTopSlider ? "sm:px-8 px-6" : ""}`}>
        <h3 className={`sm:text-3xl text-2xl font-bold mb-1 ${titleClassName}`}>{note.title}</h3>

        {note.content && !note.isEndNote && (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedData(note.content.length > 150 ? note.content.slice(0, 150).concat('...') : note.content) }}
              className={`sm:px-2 px-1 break-words sm:text-[1.25rem] text-lg min-h-[1.5rem] max-h-32 overflow-hidden sm:!leading-6 !leading-5 h-auto ${contentClassName}`}
            ></div>
          </>
        )}
        <div className={`mt-2 text-lg flex-between ${noteTime >= 2 ? 'mr-16' : ''}`}>
          <div>
            {note.isStarred && <NoteInfo text={<AiFillStar className="text-[1.9rem] inline-block text-center pb-1" />} color={note.color} />}
            <NoteInfo text={getTimeByDate(note.startDate)} color={note.color} />
            <NoteInfo text={`${note.rating}/10`} color={note.color} className="tracking-widest" />
            {note.type && <NoteInfo text={note.type.labelName} color={note.color} />}
            {note.category?.map((category) => {
              if (!category) return null;
              return <NoteInfo text={category.labelName} key={category._id} color={note.color} />;
            })}
          </div>
          {/* Deprecated for now */}
          {/* {noteTime >= 2 && (
            <div className="absolute sm:bottom-2 bottom-1 right-0 z-10">
              <NoteInfo text={`${noteTime} days`} color={note.color} className={`${note.isEndNote ? 'font-bold' : ''}`} />
            </div>
          )}
          {note.isEndNote && (
            <div className="absolute top-2 right-0 z-10">
              <NoteInfo text="Ended" color={note.color} className="font-bold" />
            </div>
          )} */}
        </div>
      </div>
      {shouldDisplaySideImages && <NoteImages images={note.images} />}
    </Link>
  );
};

export default NoteBody;
