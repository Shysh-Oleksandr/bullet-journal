import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { BsPlusLg } from 'react-icons/bs';
import { IoIosColorPalette } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks';
import config from '../../config/config';
import { setError, setSuccess } from '../../features/journal/journalSlice';
import { updateUser } from '../../features/user/userSlice';
import IUser from '../../interfaces/user';
import { COLOR_SEPARATOR, defaultNoteTypes, ICustomNoteLabel, SEPARATOR } from '../../utils/data';
import { getCustomLabels, getNewCustomNoteLabelName } from '../../utils/functions';
import { useAppDispatch } from './../../app/hooks';
import { updateUserData } from './../../features/user/userSlice';
import { getAllLabels } from './../../utils/functions';
import { noteColors } from './../../utils/data';

interface NoteLabelInputProps {
    setLabel: React.Dispatch<React.SetStateAction<string>>;
    label: string;
    isCustomTypes: boolean;
    setNoteColor: React.Dispatch<React.SetStateAction<string>>;
}

const NoteLabelInput = ({ label, setLabel, isCustomTypes, setNoteColor }: NoteLabelInputProps) => {
    const [focused, setFocused] = useState(false);
    const labelInputRef = useRef<HTMLInputElement>(null);

    const { user } = useAppSelector((store) => store.user);
    const [userCustomNoteLabels, setUserCustomNoteLabels] = useState<string>(isCustomTypes ? user.customNoteTypes || '' : user.customNoteCategories || '');
    const [availableLabels, setAvailableLabels] = useState<ICustomNoteLabel[]>(isCustomTypes ? getAllLabels(true, userCustomNoteLabels) : getCustomLabels(userCustomNoteLabels));
    const [removedLabels, setRemovedLabels] = useState<ICustomNoteLabel[]>(
        getCustomLabels(label).filter((category) => !availableLabels.map((label) => label.name).includes(category.name) && category.name !== '')
    );
    const [previousLabel, setPreviousLabel] = useState(label);
    const [color, setColor] = useState<string>(noteColors[Math.floor(Math.random() * noteColors.length)]);
    const labelName = isCustomTypes ? 'type' : 'category';
    const dispatch = useAppDispatch();
    let addedLabel = '';

    useEffect(() => {
        setAvailableLabels([...availableLabels, ...removedLabels]);
    }, []);

    useEffect(() => {
        getUser(user._id);
    }, [userCustomNoteLabels]);

    const getUser = async (id: string) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/users/read/${id}`
            });

            if (response.status === 200 || response.status === 304) {
                let user = response.data.user as IUser;
                dispatch(updateUser(user));
            } else {
                dispatch(setError('Unable to retrieve user ' + id));
            }
        } catch (error: any) {
            dispatch(setError(error.message));
        }
    };

    const onFocus = () => {
        setFocused(true);
        setPreviousLabel(label);
        setLabel('');
    };
    const onBlur = () => {
        setFocused(false);
        const labelInputText = labelInputRef.current?.value;

        setTimeout(() => {
            if (labelInputText?.trim() === '' || ![...availableLabels, addedLabel].includes(labelInputText!)) {
                setLabel(previousLabel);
            }
        }, 0);
    };

    const updateUserCustomLabels = (newCustomNoteLabels: string, isAdding: boolean, changedLabel: string) => {
        const newUserData = isCustomTypes
            ? {
                  customNoteTypes: newCustomNoteLabels
              }
            : {
                  customNoteCategories: newCustomNoteLabels
              };
        dispatch(updateUserData({ oldUser: user, newUserData }));
        setUserCustomNoteLabels(newCustomNoteLabels);
        setAvailableLabels(isCustomTypes ? getAllLabels(true, newCustomNoteLabels, removedLabels) : getAllLabels(false, newCustomNoteLabels, removedLabels));

        dispatch(setSuccess(isAdding ? `New ${labelName} "${changedLabel}" added.` : `The ${labelName} "${changedLabel}" has been deleted.`));
    };

    const addNewLabel = () => {
        let newLabel = labelInputRef.current!.value;
        const isNew: boolean = !availableLabels.map((label) => label.name).includes(newLabel);

        if (newLabel.trim() === '') {
            dispatch(setError(`Note ${labelName} cannot be empty.`));
        } else if (!isNew) {
            dispatch(setError(`Note ${labelName} "${newLabel}" already exists.`));
        } else {
            addedLabel = newLabel;
            labelInputRef.current?.blur();

            setLabel(() => {
                return isCustomTypes ? newLabel : `${previousLabel === '' ? '' : previousLabel}${getNewCustomNoteLabelName({ name: newLabel, color: color }).split(COLOR_SEPARATOR)[0]}`;
            });

            const newCustomNoteLabels = `${userCustomNoteLabels || ''}${getNewCustomNoteLabelName({ name: newLabel, color: color })}`;

            updateUserCustomLabels(newCustomNoteLabels, true, newLabel);
        }
    };

    const deleteLabel = (labelToDelete: ICustomNoteLabel) => {
        isCustomTypes ? label === labelToDelete.name && setLabel(defaultNoteTypes[0].name) : label.split(SEPARATOR)[1] === labelToDelete.name && setLabel('');

        !isCustomTypes &&
            getCustomLabels(label)
                .map((label) => label.name)
                .includes(labelToDelete.name) &&
            setLabel((prevLabel) => prevLabel.replace(`${getNewCustomNoteLabelName(labelToDelete, !!labelToDelete.color).split(COLOR_SEPARATOR)[0]}`, ''));
        const newCustomNoteLabels = userCustomNoteLabels.replace(`${getNewCustomNoteLabelName(labelToDelete, !!labelToDelete.color)}`, '');
        updateUserCustomLabels(newCustomNoteLabels, false, labelToDelete.name);
    };

    const chooseLabel = (chosenLabel: ICustomNoteLabel) => {
        if (isCustomTypes) {
            setLabel(chosenLabel.name);
        } else {
            // Check if we should choose or remove category.
            const isChoosing = !getCustomLabels(label)
                .map((label) => label.name)
                .includes(chosenLabel.name);
            // Adding category.
            if (isChoosing) {
                setLabel((prevLabel) => `${prevLabel}${getNewCustomNoteLabelName(chosenLabel).split(COLOR_SEPARATOR)[0]}`);
            }
            // Removing category.
            else {
                setLabel((prevLabel) => prevLabel.replace(`${getNewCustomNoteLabelName(chosenLabel).split(COLOR_SEPARATOR)[0]}`, ''));
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
                className={`term-input category-input font-medium w-full sm:text-xl text-lg bg-[#ebf5fe] transition-all hover:bg-[#e1f1ff] focus-within:bg-[#e1f1ff] ${
                    focused ? 'sm:pl-10 pl-8' : 'sm:pl-3 pl-1'
                } sm:pr-8 pr-5 py-1 h-11 rounded-t-sm text-[#6aaac2]`}
                placeholder={`Enter a new ${labelName}...`}
                ref={labelInputRef}
                value={isCustomTypes ? label : label.replace(SEPARATOR, '').replaceAll(SEPARATOR, ', ')}
                required={true}
                onChange={(e) => setLabel(e.target.value)}
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
                {availableLabels.map((availableLabel) => {
                    if (availableLabel.name.trim() === '') return null;

                    return (
                        <li
                            className={`relative block whitespace-nowrap overflow-hidden text-ellipsis px-8 py-2 text-lg tracking-wide transition-all cursor-pointer ${
                                (
                                    isCustomTypes
                                        ? availableLabel.name === label
                                        : getCustomLabels(label)
                                              .map((label) => label.name)
                                              .includes(availableLabel.name)
                                )
                                    ? 'bg-cyan-500 font-semibold'
                                    : ''
                            } hover:bg-cyan-700`}
                            key={availableLabel.name}
                            onClick={() => chooseLabel(availableLabel)}
                        >
                            {availableLabel.name}
                            {availableLabel.color && (
                                <button
                                    type="button"
                                    style={{ backgroundColor: availableLabel.color }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setNoteColor(availableLabel.color!);
                                    }}
                                    className="absolute z-10 left-2 top-1/2 -translate-y-1/2 cursor-pointer block w-8 h-8 rounded-full border-solid border-2 shadow-sm border-white transition-all hover:border-cyan-200 hover:shadow-md"
                                ></button>
                            )}
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
            {focused && (
                <button
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

export default NoteLabelInput;
