import axios from 'axios';
import React, { useRef, useState } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { useAppSelector } from '../../app/hooks';
import config from '../../config/config';
import { defaultNoteTypes, SEPARATOR } from '../../utils/data';
import { getCustomLabels } from '../../utils/functions';
import Alert from '../UI/Alert';

interface NoteLabelInputProps {
    setLabel: React.Dispatch<React.SetStateAction<string>>;
    label: string;
    isCustomTypes: boolean;
}

const NoteLabelInput = ({ label, setLabel, isCustomTypes }: NoteLabelInputProps) => {
    const labelInputRef = useRef<HTMLInputElement>(null);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [previousLabel, setPreviousLabel] = useState(label);

    const { user } = useAppSelector((store) => store.user);
    const [userCustomNoteLabels, setUserCustomNoteLabels] = useState<string>(isCustomTypes ? user.customNoteTypes || '' : user.customNoteCategories || '');
    const [availableLabels, setAvailableLabels] = useState<string[]>(isCustomTypes ? [...defaultNoteTypes, ...getCustomLabels(userCustomNoteLabels)] : getCustomLabels(userCustomNoteLabels));

    const labelName = isCustomTypes ? 'type' : 'category';

    const onFocus = () => {
        console.log('focus');

        setLabel('');
        setPreviousLabel(label);
    };
    const onBlur = () => {
        console.log('blur');

        if (labelInputRef.current?.value.trim() === '' || !availableLabels.includes(labelInputRef.current?.value!)) {
            setLabel(previousLabel);
        }
    };

    const updateUserData = async (newCustomNoteLabels: string, isAdding: boolean, changedLabel: string) => {
        if (isAdding && label.trim() === '') {
            setError(`Please enter ${labelName} name.`);
            setSuccess('');
            return null;
        }

        setError('');
        setSuccess('');

        const newUserData = isCustomTypes
            ? {
                  uid: user.uid,
                  name: user.name,
                  customNoteTypes: newCustomNoteLabels
              }
            : {
                  uid: user.uid,
                  name: user.name,
                  customNoteCategories: newCustomNoteLabels
              };

        try {
            const response = await axios({
                method: 'PATCH',
                url: `${config.server.url}/users/update/${user._id}`,
                data: newUserData
            });

            if (response.status === 201) {
                setUserCustomNoteLabels(newCustomNoteLabels);

                setAvailableLabels(isCustomTypes ? [...defaultNoteTypes, ...getCustomLabels(newCustomNoteLabels)] : getCustomLabels(newCustomNoteLabels));
                setSuccess(isAdding ? `New ${labelName} "${changedLabel}" added.` : `The ${labelName} "${changedLabel}" has been removed.`);
            } else {
                setError(`Unable to ${isAdding ? 'add' : 'delete'} note ${labelName}.`);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const addNewLabel = () => {
        let newLabel = labelInputRef.current!.value;
        const isNew: boolean = !availableLabels.includes(newLabel);

        console.log(previousLabel);
        console.log(newLabel);
        if (newLabel.trim() === '') {
            setError(`Note ${labelName} cannot be empty.`);
        } else if (!isNew) {
            setError(`Note ${labelName} "${newLabel}" already exist.`);
        } else {
            setLabel(isCustomTypes ? newLabel : `${previousLabel}${SEPARATOR}${newLabel}`);
            const newCustomNoteLabels = `${userCustomNoteLabels || ''}${SEPARATOR}${newLabel}`;
            console.log(newCustomNoteLabels);

            updateUserData(newCustomNoteLabels, true, newLabel);
        }
    };

    const deleteLabel = (labelToDelete: string) => {
        label === labelToDelete && setLabel(isCustomTypes ? defaultNoteTypes[0] : '');
        !isCustomTypes && label.split(SEPARATOR).includes(labelToDelete) && setLabel((prevLabel) => prevLabel.replace(`${SEPARATOR}${labelToDelete}`, ''));
        const newCustomNoteLabels = userCustomNoteLabels.replace(`${SEPARATOR}${labelToDelete}`, '');

        updateUserData(newCustomNoteLabels, false, labelToDelete);
    };

    const chooseLabel = (chosenLabel: string) => {
        if (isCustomTypes) {
            setLabel(chosenLabel);
        } else {
            // Check if we should choose or remove category.
            const isChoosing = !label.split(SEPARATOR).includes(chosenLabel);
            // Adding category.
            if (isChoosing) {
                setLabel((prevLabel) => `${prevLabel}${SEPARATOR}${chosenLabel}`);
            }
            // Removing category.
            else {
                setLabel((prevLabel) => prevLabel.replace(`${SEPARATOR}${chosenLabel}`, ''));
            }
        }
    };

    return (
        <div className="relative categories-form">
            <input
                type="text"
                id={isCustomTypes ? 'noteTypeInput' : 'noteCategoryInput'}
                onFocus={onFocus}
                onBlur={onBlur}
                className="term-input category-input font-medium w-full text-xl bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] px-3 py-1 h-11 rounded-t-sm text-[#6aaac2]"
                placeholder={`Enter a new ${labelName}...`}
                ref={labelInputRef}
                value={isCustomTypes ? label : label.replace(SEPARATOR, '').replaceAll(SEPARATOR, ', ')}
                required={true}
                onChange={(e) => setLabel(e.target.value)} // !
            />
            <ul
                className={`categories-list rounded-b-xl overflow-y-auto h-auto max-h-0 opacity-0 left-1/2 overflow-hidden -translate-x-1/2 w-full transition-all duration-300 absolute bg-cyan-600 bottom-0 translate-y-full z-20 text-white`}
            >
                {availableLabels.map((availableLabel) => {
                    if (availableLabel.trim() === '') return null;

                    return (
                        <li
                            className={`relative block px-4 py-2 text-lg tracking-wide transition-all cursor-pointer ${
                                (isCustomTypes ? availableLabel === label : label.split(SEPARATOR).includes(availableLabel)) ? 'bg-cyan-500 font-semibold' : ''
                            } hover:bg-cyan-700`}
                            key={availableLabel}
                            onClick={() => chooseLabel(availableLabel)}
                        >
                            {availableLabel}
                            {!defaultNoteTypes.includes(availableLabel) && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLabel(availableLabel);
                                    }}
                                    className="absolute right-2 top-1/2 rounded-md -translate-y-1/2 text-xl p-[5px] transition-colors bg-cyan-800 hover:bg-cyan-900"
                                >
                                    <BsPlusLg className="rotate-45" />
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
            <button
                onMouseDown={(e) => e.preventDefault()}
                type="button"
                className="absolute right-0 top-1/2 py-2 px-2 -translate-y-1/2 text-2xl hover:text-cyan-500 text-cyan-400 transition-colors"
                onClick={addNewLabel}
            >
                <AiOutlineArrowRight />
            </button>
            <Alert message={error} isError={true} />
            <Alert message={success} isError={false} />
        </div>
    );
};

export default NoteLabelInput;
