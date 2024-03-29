import React, { useRef } from 'react';
import Loading from './Loading';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { getLinearGradientStyle } from '../../utils/functions';

const bgColor = "#c31515"
const linearGradientStyle = getLinearGradientStyle(bgColor)

type Props = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleting: boolean;
  deleteNote: () => Promise<void>;
};

const DeleteModal = ({ setModal, deleting, deleteNote }: Props) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  useOnClickOutside(ref, () => setModal(false));

  return (
    <div className="fixed z-[100000] h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-40">
      <div className="rounded-xl md:p-10 sm:p-8 p-6 md:pt-6 pt-4 lg:basis-[40vw] sm:basis-[60vw] basis-[90vw] modal mx-4 fixed block shadow-xl text-white" ref={ref} style={linearGradientStyle}>
        <h2 className="sm:text-4xl text-3xl sm:leading-8 leading-7 text-center pt-2 pb-4 font-semibold border-bottom">{deleting ? 'Deleting' : "Are you sure you?"}</h2>
        {deleting ? <Loading className="my-4" /> : <h3 className="md:mb-8 mb-6 sm:text-2xl text-xl mt-2 sm:leading-8 leading-7 text-center">It will delete the note permanently. This action cannot be undone</h3>}
        <div className="flex justify-center items-center">
          <button className="block btn sm:py-4 py-3 mr-2 !bg-black shadow-md text-white hover:!bg-slate-700 hover:shadow-lg" onClick={deleteNote}>
            Delete
          </button>
          <button
            className="block btn sm:!text-xl sm:py-4 py-3 shadow-md !bg-[rgb(177,201,211)] hover:shadow-lg hover:!bg-[rgb(161,183,192)]"
            onClick={() => {
              setModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
