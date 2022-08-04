import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import config from '../../../config/config';
import { setError, setSuccess } from '../../../features/journal/journalSlice';
import { useFetchData } from '../../../hooks';
import { defaultNoteTypes, noteColors } from '../../../utils/data';
import ICustomLabel from '../../../interfaces/customLabel';
import { getRandomColor } from './../../../utils/functions';
import { useLocation } from 'react-router-dom';

interface NoteLabelInputProps {
    setLabel: React.Dispatch<React.SetStateAction<ICustomLabel>>;
    label: ICustomLabel;
    disabled?: boolean;
    setNoteColor: React.Dispatch<React.SetStateAction<string>>;
}

const NoteTypeInput = ({ label, setLabel, setNoteColor, disabled }: NoteLabelInputProps) => {
    const { user } = useAppSelector((store) => store.user);
    const [fetchLabels, setFetchLabels] = useState(false);
    const [customLabels] = useFetchData<ICustomLabel>('GET', `${config.server.url}/customlabels/${user._id}`, 'customLabels', fetchLabels);

    const currentCustomLabels = customLabels.filter((label) => !label.isCategoryLabel);
    const [focused, setFocused] = useState(false);
    const labelInputRef = useRef<HTMLInputElement>(null);
    const labelAddRef = useRef<HTMLButtonElement>(null);

    const [inputLabel, setInputLabel] = useState(label.labelName);

    const [previousLabel, setPreviousLabel] = useState<string>(label.labelName);
    const [color, setColor] = useState<string>(getRandomColor());
    const labelName = 'type';
    const dispatch = useAppDispatch();
    const [addedLabel, setAddedLabel] = useState('');

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (document.activeElement === labelInputRef.current) {
                    labelAddRef.current?.click();
                }
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    useEffect(() => {
        setInputLabel(label.labelName);
    }, [label]);

    const onFocus = () => {
        setFocused(true);
        setPreviousLabel(label.labelName);
        setInputLabel('');
    };
    const onBlur = () => {
        setFocused(false);
        const labelInputText = labelInputRef.current?.value;

        setTimeout(() => {
            if (labelInputText?.trim() === '' || ![...currentCustomLabels.map((label) => label.labelName), addedLabel].includes(labelInputText!)) {
                setInputLabel(previousLabel);
            }
        }, 0);
    };

    const addNewLabel = async () => {
        let newLabel = labelInputRef.current!.value;
        const isNew: boolean = !currentCustomLabels.map((label) => label.labelName).includes(newLabel);

        if (newLabel.trim() === '') {
            dispatch(setError(`Note ${labelName} cannot be empty.`));
        } else if (!isNew) {
            dispatch(setError(`Note ${labelName} "${newLabel}" already exists.`));
        } else {
            try {
                const response = await axios({
                    method: 'POST',
                    url: `${config.server.url}/customlabels/create`,
                    data: {
                        labelName: newLabel,
                        color: color,
                        isCategoryLabel: false,
                        user: user._id
                    }
                });

                if (response.status === 201) {
                    dispatch(setSuccess(`New ${labelName} "${newLabel}" added.`));
                    setAddedLabel(newLabel);
                    setFetchLabels(!fetchLabels);

                    setLabel(response.data.customLabel);
                    setInputLabel(newLabel);

                    setColor(getRandomColor());
                } else {
                    dispatch(setError(`Unable to create note ${labelName}.`));
                }
            } catch (error: any) {
                dispatch(setError(error.message));
            }
            labelInputRef.current?.blur();
        }
    };

    const deleteLabel = async (labelToDelete: ICustomLabel) => {
        if (disabled) return;

        try {
            const response = await axios({
                method: 'DELETE',
                url: `${config.server.url}/customlabels/${labelToDelete._id}`
            });

            if (response.status === 200) {
                dispatch(setSuccess(`Note ${labelName} "${labelToDelete.labelName}" has been deleted.`));
                setFetchLabels(!fetchLabels);
                if (label._id === labelToDelete._id) {
                    const newLabel = currentCustomLabels[0] || currentCustomLabels[1];
                    setLabel(newLabel);
                    setInputLabel(newLabel.labelName);
                }
            } else {
                dispatch(setError(`Unable to delete note ${labelName}.`));
            }
        } catch (error: any) {
            dispatch(setError(error.message));
        }
    };

    const chooseLabel = (chosenLabel: ICustomLabel) => {
        if (disabled) return;
        setLabel(chosenLabel);
        setInputLabel(chosenLabel.labelName);
    };

    return (
        <div className="relative categories-form">
            <input
                type="text"
                id={'noteTypeInput'}
                onFocus={onFocus}
                onBlur={onBlur}
                className={`term-input category-input font-medium w-full sm:text-xl text-lg bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] ${
                    focused ? 'sm:pl-10 pl-8' : 'sm:pl-3 pl-1'
                } sm:pr-8 pr-5 py-1 h-11 rounded-t-sm text-[#6aaac2]`}
                placeholder={`Enter a new ${labelName}...`}
                ref={labelInputRef}
                value={inputLabel}
                required={true}
                disabled={disabled === undefined ? false : disabled}
                onChange={(e) => setInputLabel(e.target.value)}
            />
            <label
                style={{ color: color }}
                htmlFor={'noteCustomTypeColorInput'}
                className={`absolute left-1 top-1/2 -translate-y-1/2 ${
                    focused ? 'opacity-100 visible' : 'invisible opacity-0'
                } cursor-pointer sm:text-3xl text-2xl transition-all duration-300 text-[#6aaac2]`}
            >
                <IoIosColorPalette />
            </label>
            <input
                type="color"
                id={'noteCustomTypeColorInput'}
                className="hidden"
                disabled={disabled === undefined ? false : disabled}
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                    labelInputRef.current?.focus();
                }}
            />

            <ul
                className={`categories-list rounded-b-xl shadow-xl overflow-y-auto h-auto max-h-0 opacity-0 sm:left-1/2 left-0 overflow-hidden sm:-translate-x-1/2 sm:w-full w-[70vw] transition-all duration-300 absolute bg-cyan-600 bottom-0 translate-y-full z-[200] text-white`}
            >
                {[...defaultNoteTypes, ...currentCustomLabels].map((customLabel) => {
                    if (customLabel.labelName.trim() === '') return null;

                    return (
                        <li
                            className={`relative block whitespace-nowrap overflow-hidden text-ellipsis px-8 py-2 text-lg tracking-wide transition-all cursor-pointer ${
                                label._id === customLabel._id ? '!bg-cyan-500 font-semibold' : ''
                            } hover:bg-cyan-700`}
                            key={customLabel.labelName}
                            onClick={() => chooseLabel(customLabel)}
                        >
                            {customLabel.labelName}
                            {customLabel.color && (
                                <button
                                    type="button"
                                    style={{ backgroundColor: customLabel.color }}
                                    onClick={(e) => {
                                        if (disabled) return;
                                        e.stopPropagation();
                                        setNoteColor(customLabel.color!);
                                    }}
                                    className="absolute z-10 left-2 top-1/2 -translate-y-1/2 cursor-pointer block w-8 h-8 rounded-full border-solid border-2 shadow-sm border-white transition-all hover:border-cyan-200 hover:shadow-md"
                                ></button>
                            )}
                            {!defaultNoteTypes.map((type) => type.labelName).includes(customLabel.labelName) && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLabel(customLabel);
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
            {focused && (
                <button
                    ref={labelAddRef}
                    onMouseDown={(e) => e.preventDefault()}
                    type="button"
                    className="absolute sm:right-0 -right-2 top-1/2 py-2 px-2 -translate-y-1/2 text-2xl hover:text-cyan-500 text-cyan-400 transition-colors"
                    onClick={addNewLabel}
                >
                    <AiOutlineArrowRight />
                </button>
            )}
        </div>
    );
};

export default NoteTypeInput;
