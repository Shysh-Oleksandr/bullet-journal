import axios from 'axios';
import React, { useRef, useState } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { useAppSelector } from '../../app/hooks';
import config from './../../config/config';
import { defaultNoteTypes, SEPARATOR } from './../../utils/data';
import Alert from './../UI/Alert';

interface NoteTypeInputProps {
    setType: React.Dispatch<React.SetStateAction<string>>;
    type: string;
}

function getCustomTypes(customTypes: string | undefined): string[] {
    return customTypes?.split(SEPARATOR) || [];
}

const NoteTypeInput = ({ type, setType }: NoteTypeInputProps) => {
    const [focused, setFocused] = useState<boolean>(false);
    const typeInputRef = useRef<HTMLInputElement>(null);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [previousType, setPreviousType] = useState(type);

    const { user } = useAppSelector((store) => store.user);
    const [userCustomNoteTypes, setUserCustomNoteTypes] = useState<string>(user.customNoteTypes || '');
    const [availableTypes, setAvailableTypes] = useState<string[]>([...defaultNoteTypes, ...getCustomTypes(userCustomNoteTypes)]);

    const onFocus = () => {
        setFocused(true);
        setType('');
        setPreviousType(type);
    };
    const onBlur = () => {
        setFocused(false);
        typeInputRef.current?.value.trim() === '' && setType(previousType);
    };

    const updateUserData = async (newCustomNoteTypes: string, isAdding: boolean, changedType: string) => {
        if (type.trim() === '') {
            setError('Please enter type name.');
            setSuccess('');
            return null;
        }

        setError('');
        setSuccess('');

        try {
            const response = await axios({
                method: 'PATCH',
                url: `${config.server.url}/users/update/${user._id}`,
                data: {
                    uid: user.uid,
                    name: user.name,
                    customNoteTypes: newCustomNoteTypes
                }
            });

            if (response.status === 201) {
                setUserCustomNoteTypes(newCustomNoteTypes);
                setAvailableTypes([...defaultNoteTypes, ...getCustomTypes(newCustomNoteTypes)]);
                setSuccess(isAdding ? `New type "${changedType}" added.` : `Type "${changedType}" has been removed.`);
            } else {
                setError(`Unable to ${isAdding ? 'add' : 'delete'} note type.`);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const addNewCategory = () => {
        let newType = typeInputRef.current!.value;
        const isNew: boolean = !availableTypes.includes(newType);

        if (newType.trim() === '') {
            setError('Note type cannot be empty.');
        } else if (!isNew) {
            setError(`Note type "${newType}" already exist.`);
        } else {
            setType(newType);
            const newCustomNoteTypes = `${userCustomNoteTypes || ''}${SEPARATOR}${newType}`;
            updateUserData(newCustomNoteTypes, true, newType);
        }
    };

    const deleteCategory = (typeToDelete: string) => {
        type === typeToDelete && setType('');
        const newCustomNoteTypes = userCustomNoteTypes.replace(`${SEPARATOR}${typeToDelete}`, '');

        updateUserData(newCustomNoteTypes, false, typeToDelete);
    };

    return (
        <div className="relative categories-form">
            <input
                type="text"
                id="noteTypeInput"
                onFocus={onFocus}
                onBlur={onBlur}
                className="term-input category-input font-medium w-full text-xl bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] px-3 py-1 h-11 rounded-t-sm text-[#6aaac2]"
                placeholder="Enter a new type..."
                ref={typeInputRef}
                value={type}
                required={true}
                onChange={(e) => setType(e.target.value)}
            />
            <ul
                className={`categories-list rounded-b-xl overflow-y-auto h-auto max-h-0 opacity-0 left-1/2 overflow-hidden -translate-x-1/2 w-full transition-all duration-300 absolute bg-cyan-600 bottom-0 translate-y-full z-20 text-white`}
            >
                {availableTypes.map((availableType) => {
                    if (availableType.trim() === '') return null;

                    return (
                        <li
                            className={`relative block px-4 py-2 text-lg tracking-wide transition-all cursor-pointer ${availableType === type ? 'bg-cyan-500 font-semibold' : ''} hover:bg-cyan-700`}
                            key={availableType}
                            onClick={() => setType(availableType)}
                        >
                            {availableType}
                            {!defaultNoteTypes.includes(availableType) && (
                                <button
                                    type="button"
                                    onClick={() => deleteCategory(availableType)}
                                    className="absolute right-2 top-1/2 rounded-md -translate-y-1/2 text-xl p-[5px] transition-colors bg-cyan-800 hover:bg-cyan-900"
                                >
                                    <BsPlusLg className="rotate-45" />
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
            <button type="button" className="absolute right-0 top-1/2 py-2 px-2 -translate-y-1/2 text-2xl hover:text-cyan-500 text-cyan-400 transition-colors" onClick={addNewCategory}>
                <AiOutlineArrowRight />
            </button>
            <Alert message={error} isError={true} />
            <Alert message={success} isError={false} />
        </div>
    );
};

export default NoteTypeInput;
