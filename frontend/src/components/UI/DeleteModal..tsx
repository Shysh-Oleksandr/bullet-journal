import React, { useRef } from 'react';
import { useOnClickOutside } from '../../hooks';
import Loading from './Loading';

type Props = {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modal: boolean;
    deleting: boolean;
    deleteNote: () => Promise<void>;
};

const DeleteModal = ({ setModal, modal, deleting, deleteNote }: Props) => {
    const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
    useOnClickOutside(ref, () => setModal(false));

    return (
        <div className="fixed z-[100000] h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-40">
            <div className="bg-[rgb(197,221,231)] rounded-xl md:p-10 sm:p-8 p-6 md:pt-6 pt-4 lg:basis-[40vw] sm:basis-[60vw] basis-[90vw] modal mx-4 fixed block shadow-xl" ref={ref}>
                <h2 className="sm:text-4xl text-3xl sm:leading-8 leading-7 text-center pt-2 pb-4 font-semibold border-bottom">Delete</h2>
                {deleting ? <Loading className="my-4" /> : <h3 className="md:mb-8 mb-6 sm:text-2xl text-xl mt-2 sm:leading-8 leading-7 text-center">Are you sure you want to delete this note?</h3>}
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
