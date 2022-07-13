import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useWindowSize } from '../../../hooks';

interface NoteContentEditorProps {
    setEditorState: (value: React.SetStateAction<EditorState>) => void;
    setContent: (value: React.SetStateAction<string>) => void;
    setImage: (value: React.SetStateAction<string>) => void;
    editorState: EditorState;
    isShort?: boolean;
}

const NoteContentEditor = ({ setEditorState, setContent, setImage, editorState, isShort }: NoteContentEditorProps) => {
    const [width] = useWindowSize();
    const onEditorStateChange = (newState: EditorState) => {
        const newContent = draftToHtml(convertToRaw(newState.getCurrentContent()));
        setEditorState(newState);
        setContent(newContent);

        const regex = /(?<=src=")(.*)(?=" alt)/g;
        const images = newContent.match(regex);

        images && setImage(images[0]);
    };

    return (
        <Editor
            placeholder="Write your note here..."
            editorState={editorState}
            toolbarClassName="toolbarClassName border-cyan-100 border-2 rounded-sm z-[150] sticky sm:top-[65px] top-[50px] left-0"
            wrapperClassName="mt-8"
            editorClassName={`${
                isShort ? 'min-h-[15vh]' : 'min-h-[45vh]'
            } h-auto  cursor-text border-cyan-100 transition-all border-2 rounded-sm border-solid focus-within:border-[3px] focus-within:border-cyan-200 px-3 text-[1.25rem] !leading-[100%]`}
            toolbar={
                isShort
                    ? {
                          options: ['inline', 'fontSize', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
                          inline: { inDropdown: true },
                          textAlign: { inDropdown: true },
                          link: { inDropdown: true },
                          history: { inDropdown: true }
                      }
                    : width < 640
                    ? {
                          options: ['inline', 'fontSize', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
                          inline: { inDropdown: true },
                          textAlign: { inDropdown: true },
                          link: { inDropdown: true },
                          history: { inDropdown: true }
                      }
                    : {}
            }
            onEditorStateChange={onEditorStateChange}
        />
    );
};

export default NoteContentEditor;
