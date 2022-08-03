import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import config from '../../../config/config';
import { setError, setSuccess } from '../../../features/journal/journalSlice';
import { updateUser, updateUserData } from '../../../features/user/userSlice';
import { useFetchData } from '../../../hooks';
import IUser from '../../../interfaces/user';
import { COLOR_SEPARATOR, defaultNoteTypes, ICustomNoteLabel, noteColors, SEPARATOR } from '../../../utils/data';
import { getNewCustomNoteLabelName } from '../../../utils/functions';
import ICustomLabel from './../../../interfaces/customLabel';

interface NoteLabelInputProps {
    setLabel: React.Dispatch<React.SetStateAction<ICustomLabel>> | React.Dispatch<React.SetStateAction<ICustomLabel[]>>;
    label: ICustomLabel;
    isCustomTypes: boolean;
    disabled?: boolean;
    setNoteColor: React.Dispatch<React.SetStateAction<string>>;
}

const NoteLabelInput = ({ label, setLabel, isCustomTypes, setNoteColor, disabled }: NoteLabelInputProps) => {
    const { user } = useAppSelector((store) => store.user);
    const [customLabels, loadingCustomLabels] = useFetchData<ICustomLabel>('GET', `${config.server.url}/customlabels/${user._id}`, 'customLabels');
    const currentCustomLabels = isCustomTypes ? customLabels.filter((label) => !label.isCategoryLabel) : customLabels.filter((label) => label.isCategoryLabel);
    const [focused, setFocused] = useState(false);
    const labelInputRef = useRef<HTMLInputElement>(null);
    const labelAddRef = useRef<HTMLButtonElement>(null);
    const [inputLabel, setInputLabel] = useState(label.labelName); // CAT

    const [userCustomNoteLabels, setUserCustomNoteLabels] = useState<string>(isCustomTypes ? user.customNoteTypes || '' : user.customNoteCategories || '');
    // const [availableLabels, setAvailableLabels] = useState<ICustomNoteLabel[]>(isCustomTypes ? getAllLabels(true, userCustomNoteLabels) : getCustomLabels(userCustomNoteLabels));
    // const [removedLabels, setRemovedLabels] = useState<ICustomNoteLabel[]>(
    //     getCustomLabels(label).filter((category) => !availableLabels.map((label) => label.name).includes(category.name) && category.name !== '')
    // );
    const [previousLabel, setPreviousLabel] = useState<string>(label.labelName);
    const [color, setColor] = useState<string>(noteColors[Math.floor(Math.random() * noteColors.length)]);
    const labelName = isCustomTypes ? 'type' : 'category';
    const dispatch = useAppDispatch();
    let addedLabel = '';

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

    const onFocus = () => {
        setFocused(true);
        setPreviousLabel(label.labelName);
        setInputLabel('');
    };
    const onBlur = () => {
        setFocused(false);
        const labelInputText = labelInputRef.current?.value;

        setTimeout(() => {
            if (labelInputText?.trim() === '') {
                // || ![...availableLabels, addedLabel].includes(labelInputText!)
                setInputLabel(previousLabel);
            }
        }, 0);
    };

    // const updateUserCustomLabels = (newCustomNoteLabels: string, isAdding: boolean, changedLabel: string) => {
    //     const newUserData = isCustomTypes
    //         ? {
    //               customNoteTypes: newCustomNoteLabels
    //           }
    //         : {
    //               customNoteCategories: newCustomNoteLabels
    //           };
    //     dispatch(updateUserData({ oldUser: user, newUserData }));
    //     setUserCustomNoteLabels(newCustomNoteLabels);
    //     setAvailableLabels(isCustomTypes ? getAllLabels(true, newCustomNoteLabels, removedLabels) : getAllLabels(false, newCustomNoteLabels, removedLabels));

    //     dispatch(setSuccess(isAdding ? `New ${labelName} "${changedLabel}" added.` : `The ${labelName} "${changedLabel}" has been deleted.`));
    // };

    // const addNewLabel = () => {
    //     let newLabel = labelInputRef.current!.value;
    //     const isNew: boolean = !availableLabels.map((label) => label.name).includes(newLabel);

    //     if (newLabel.trim() === '') {
    //         dispatch(setError(`Note ${labelName} cannot be empty.`));
    //     } else if (!isNew) {
    //         dispatch(setError(`Note ${labelName} "${newLabel}" already exists.`));
    //     } else {
    //         addedLabel = newLabel;
    //         labelInputRef.current?.blur();

    //         setLabel(() => {
    //             return isCustomTypes ? newLabel : `${previousLabel === '' ? '' : previousLabel}${getNewCustomNoteLabelName({ name: newLabel, color: color }).split(COLOR_SEPARATOR)[0]}`;
    //         });

    //         const newCustomNoteLabels = `${userCustomNoteLabels || ''}${getNewCustomNoteLabelName({ name: newLabel, color: color })}`;

    //         updateUserCustomLabels(newCustomNoteLabels, true, newLabel);
    //     }
    // };

    // const deleteLabel = (labelToDelete: ICustomNoteLabel) => {
    //     if (disabled) return;

    //     isCustomTypes ? label === labelToDelete.name && setLabel(defaultNoteTypes[0].name) : label.split(SEPARATOR)[1] === labelToDelete.name && setLabel('');

    //     !isCustomTypes &&
    //         getCustomLabels(label)
    //             .map((label) => label.name)
    //             .includes(labelToDelete.name) &&
    //         setLabel((prevLabel) => prevLabel.replace(`${getNewCustomNoteLabelName(labelToDelete, !!labelToDelete.color).split(COLOR_SEPARATOR)[0]}`, ''));
    //     const newCustomNoteLabels = userCustomNoteLabels.replace(`${getNewCustomNoteLabelName(labelToDelete, !!labelToDelete.color)}`, '');
    //     updateUserCustomLabels(newCustomNoteLabels, false, labelToDelete.name);
    // };

    // const chooseLabel = (chosenLabel: ICustomNoteLabel) => {
    //     if (disabled) return;
    //     if (isCustomTypes) {
    //         setLabel(chosenLabel.name);
    //     } else {
    //         // Check if we should choose or remove category.
    //         const isChoosing = !getCustomLabels(label)
    //             .map((label) => label.name)
    //             .includes(chosenLabel.name);
    //         // Adding category.
    //         if (isChoosing) {
    //             setLabel((prevLabel) => `${prevLabel}${getNewCustomNoteLabelName(chosenLabel).split(COLOR_SEPARATOR)[0]}`);
    //         }
    //         // Removing category.
    //         else {
    //             setLabel((prevLabel) => prevLabel.replace(`${getNewCustomNoteLabelName(chosenLabel).split(COLOR_SEPARATOR)[0]}`, ''));
    //         }
    //     }
    // };

    return (
        <div className="relative categories-form">
            <input
                type="text"
                id={isCustomTypes ? 'noteTypeInput' : 'noteCategoryInput'}
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
                htmlFor={isCustomTypes ? 'noteCustomTypeColorInput' : 'noteCustomCategoryColorInput'}
                className={`absolute left-1 top-1/2 -translate-y-1/2 ${
                    focused ? 'opacity-100 visible' : 'invisible opacity-0'
                } cursor-pointer sm:text-3xl text-2xl transition-all duration-300 text-[#6aaac2]`}
            >
                <IoIosColorPalette />
            </label>
            <input
                type="color"
                id={isCustomTypes ? 'noteCustomTypeColorInput' : 'noteCustomCategoryColorInput'}
                className="hidden"
                disabled={disabled === undefined ? false : disabled}
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                    labelInputRef.current?.focus();
                }}
            />

            <ul
                className={`categories-list rounded-b-xl shadow-xl overflow-y-auto h-auto max-h-0 opacity-0 sm:left-1/2 ${
                    isCustomTypes ? 'left-0' : 'right-0'
                } overflow-hidden sm:-translate-x-1/2 sm:w-full w-[70vw] transition-all duration-300 absolute bg-cyan-600 bottom-0 translate-y-full z-[200] text-white`}
            >
                {currentCustomLabels.map((customLabel) => {
                    if (customLabel.labelName.trim() === '') return null;

                    return (
                        <li
                            className={`relative block whitespace-nowrap overflow-hidden text-ellipsis px-8 py-2 text-lg tracking-wide transition-all cursor-pointer ${
                                false ? 'bg-cyan-500 font-semibold' : ''
                            } hover:bg-cyan-700`}
                            key={customLabel.labelName}
                            // onClick={() => chooseLabel(customLabel)}
                        >
                            {customLabel.labelName}
                            {customLabel.color && (
                                <button
                                    type="button"
                                    style={{ backgroundColor: customLabel.color }}
                                    onClick={(e) => {
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
                                        // deleteLabel(customLabel);
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
                    // onClick={addNewLabel}
                >
                    <AiOutlineArrowRight />
                </button>
            )}
        </div>
    );
};

export default NoteLabelInput;
