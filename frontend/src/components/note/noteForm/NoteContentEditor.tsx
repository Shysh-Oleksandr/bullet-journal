import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';

interface NoteContentEditorProps {
    setEditorState: (value: React.SetStateAction<EditorState>) => void;
    setContent: (value: React.SetStateAction<string>) => void;
    setImage: (value: React.SetStateAction<string>) => void;
    editorState: EditorState;
    disabled?: boolean;
    isShort?: boolean;
}

const NoteContentEditor = ({ setEditorState, setContent, setImage, editorState, isShort, disabled }: NoteContentEditorProps) => {
    const onEditorStateChange = (newState: EditorState) => {
        const newContent = draftToHtml(convertToRaw(newState.getCurrentContent()));
        setEditorState(newState);
        setContent(newContent);

        const regex = /(?<=src=")(.*)(?=" alt)/g;
        const images = newContent.match(regex);

        images && setImage(images[0]);
    };

    const toolbarOptions = isShort
        ? {
              options: ['inline', 'fontSize', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
              inline: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true }
          }
        : document.documentElement.clientWidth < 640
        ? {
              options: ['inline', 'fontSize', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
              inline: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true }
          }
        : {};
    return (
        <Editor
            key={'Editor'}
            placeholder="Write your note here..."
            editorState={editorState}
            toolbarClassName={`toolbarClassName border-cyan-100 border-2 rounded-sm z-[150] ${document.documentElement.offsetWidth > 768 ? 'sticky' : ''} sm:top-[65px] top-[50px] left-0`}
            wrapperClassName="mt-8"
            readOnly={disabled === undefined ? false : disabled}
            editorClassName={`${
                isShort ? (document.documentElement.offsetHeight > 600 ? 'min-h-[20vh]' : 'min-h-[30vh]') : 'min-h-[45vh]'
            } h-auto  cursor-text border-cyan-100 transition-all border-2 rounded-sm border-solid focus-within:border-[3px] focus-within:border-cyan-200 px-3 text-[1.25rem] !leading-[100%]`}
            toolbar={toolbarOptions}
            onEditorStateChange={onEditorStateChange}
        />
    );
};

export default NoteContentEditor;
