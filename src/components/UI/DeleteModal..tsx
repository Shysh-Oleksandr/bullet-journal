import React, { useEffect, useRef } from 'react';
import InfoMessage from '../InfoMessage';
import Loading from '../Loading';

type Props = {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modal: boolean;
    deleting: boolean;
    error: string;
    deleteNote: () => Promise<void>;
};

const DeleteModal = ({ setModal, modal, deleting, error, deleteNote }: Props) => {
    const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        // document.documentElement.classList.add('stop-scrolling');
        const checkIfClickedOutside = (e: any) => {
            if (modal && ref.current && !ref.current.contains(e.target)) {
                setModal(false);
            }
        };

        document.addEventListener('mousedown', checkIfClickedOutside);

        return () => {
            // document.documentElement.classList.remove('stop-scrolling');
            document.removeEventListener('mousedown', checkIfClickedOutside);
        };
    }, [modal]);

    return (
        <div className="fixed z-50 h-full w-full top-0 flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-[rgb(197,221,231)] rounded-xl md:p-10 sm:p-8 p-6 md:pt-6 pt-4 lg:basis-2/5 sm:basis-3/5 basis-5/6 modal mx-4 fixed block" ref={ref}>
                <h2 className="text-4xl leading-8 text-center py-2 font-semibold border-bottom">Delete</h2>
                {deleting ? <Loading /> : <h3 className="md:mb-8 mb-6 text-2xl mt-2 leading-8 text-center">Are you sure you want to delete this blog?</h3>}
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
                <InfoMessage isError={true} message={error || ''} />
            </div>
        </div>
    );
};

export default DeleteModal;
