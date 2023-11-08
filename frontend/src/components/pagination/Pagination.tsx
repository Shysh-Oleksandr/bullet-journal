import { memo, useEffect, useState } from 'react';
import { MdArrowForwardIos } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import Notes from '../note/Notes';
import { useAppSelector } from '../../store/helpers/storeHooks';
import { Note } from '../../features/journal/types';
import { getNotes } from '../../features/journal/journalSlice';

interface PaginationProps {
  topRef?: React.MutableRefObject<HTMLDivElement>;
}

const Pagination = ({ topRef }: PaginationProps) => {
  const notes = useAppSelector(getNotes);

  const [currentItems, setCurrentItems] = useState<Note[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(notes.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(notes.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, notes]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    topRef?.current.scrollIntoView({ behavior: 'smooth' })
    const newOffset = (event.selected * itemsPerPage) % notes.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Notes notes={currentItems} />
      {notes.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          previousLabel={<MdArrowForwardIos className="text-3xl text-center rotate-180 sm:mx-2 mx-1 text-cyan-700 transition-colors hover:text-cyan-600" />}
          nextLabel={<MdArrowForwardIos className="text-3xl text-center sm:mx-2 mx-1 text-cyan-700 transition-colors hover:text-cyan-600" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          containerClassName="sm:pt-3 pt-1 flex gap-1 items-center justify-center text-xl list-none"
          pageLinkClassName="py-2 px-4 cursor-pointer rounded transition-all text-cyan-700 hover:bg-cyan-500 hover:text-white"
          activeLinkClassName="bg-cyan-600 !text-white"
          renderOnZeroPageCount={() => null}
        />
      )}
    </>
  );
};

export default memo(Pagination);
