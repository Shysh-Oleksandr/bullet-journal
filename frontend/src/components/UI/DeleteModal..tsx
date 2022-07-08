import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../app/hooks';
import Loading from './Loading';

type Props = {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modal: boolean;
    deleting: boolean;
    deleteNote: () => Promise<void>;
};

const DeleteModal = ({ setModal, modal, deleting, deleteNote }: Props) => {
    const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
    const { error } = useAppSelector((store) => store.journal);

    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (modal && ref.current && !ref.current.contains(e.target)) {
                setModal(false);
            }
        };

        document.addEventListener('mousedown', checkIfClickedOutside);

        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside);
        };
    }, [modal]);

    return (
        <div className="fixed z-[100000] h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-40">
            <div className="bg-[rgb(197,221,231)] rounded-xl md:p-10 sm:p-8 p-6 md:pt-6 pt-4 lg:basis-2/5 sm:basis-3/5 basis-5/6 modal mx-4 fixed block shadow-xl" ref={ref}>
                <h2 className="text-4xl leading-8 text-center pt-2 pb-4 font-semibold border-bottom">Delete</h2>
                {deleting ? <Loading className="my-4" /> : <h3 className="md:mb-8 mb-6 text-2xl mt-2 leading-8 text-center">Are you sure you want to delete this blog?</h3>}
                <div className="flex justify-center items-center">
                    <button className="block btn py-4 mr-2 !bg-black shadow-md text-white hover:!bg-slate-700 hover:shadow-lg" onClick={deleteNote}>
                        Delete permanently
                    </button>
                    <button
                        className="block btn py-4 shadow-md !bg-[rgb(177,201,211)] hover:shadow-lg hover:!bg-[rgb(161,183,192)]"
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
