import React, { RefObject, useId, useRef, useState } from "react";
import { BiCalendarAlt } from "react-icons/bi";
import { BsDashLg } from "react-icons/bs";
import { IoIosColorPalette } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Editor, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const NoteForm = () => {
  const nameRef = useRef() as RefObject<HTMLInputElement>;
  const colorRef = useRef() as RefObject<HTMLLabelElement>;
  const navigate = useNavigate();
  // const [editorState, setEditorState] = useState<EditorState>(
  //   EditorState.createEmpty()
  // );

  // const onEditorStateChange = (editorState: EditorState) => {
  //   setEditorState(editorState);
  // };

  const saveNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameRef.current?.value.trim() === "") return;
    // saveCurrentSet();
    navigate(`/note/${3}`);
  };

  return (
    <form
      className="px-10 py-3 bg-white shadow-2xl mx-32 my-12"
      onSubmit={(e) => saveNote(e)}
    >
      <div className="flex justify-between items-center">
        <input
          tabIndex={0}
          type="text"
          placeholder="Title"
          ref={nameRef}
          className="border-bottom py-4 text-3xl w-full"
          required={true}
        />
      </div>
      <div className="flex items-center justify-between border-bottom mb-3">
        <div className="flex items-center">
          <div className="relative ">
            <div className="flex items-center">
              <label
                htmlFor="startDateInput"
                className="cursor-pointer text-2xl"
              >
                <BiCalendarAlt />
              </label>
              <input
                type="date"
                id="startDateInput"
                className="pl-2 py-3 cursor-pointer"
                defaultValue={new Date().toLocaleDateString("en-CA")}
              />
            </div>
            <label
              htmlFor="startDateInput"
              className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 "
            >
              Start date
            </label>
          </div>
          <span className="mx-8 text-xl">
            <BsDashLg />
          </span>
          <div className="relative">
            <div className="flex items-center">
              <label htmlFor="endDateInput" className="cursor-pointer text-2xl">
                <BiCalendarAlt />
              </label>
              <input
                type="date"
                id="endDateInput"
                className="pl-2 py-3 cursor-pointer"
                defaultValue={new Date().toLocaleDateString("en-CA")}
              />
            </div>
            <label
              htmlFor="endDateInput"
              className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 "
            >
              End date
            </label>
          </div>
        </div>
        <div className="relative flex items-center">
          <label
            ref={colorRef}
            htmlFor="noteColorInput"
            className="cursor-pointer text-3xl px-4 text-[#6aaac2] py-2"
          >
            <IoIosColorPalette />
          </label>
          <input
            type="color"
            id="noteColorInput"
            className="hidden"
            defaultValue={"#6aaac2"}
            onChange={(e) => {
              colorRef.current!.style.color = e.target.value;
            }}
          />
          <label
            htmlFor="endDateInput"
            className="text-xs block text-left cursor-pointer absolute -bottom-[16px] left-1/2 -translate-x-1/2 "
          >
            Color
          </label>
        </div>
      </div>
      <div>
        {/* <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
        /> */}
      </div>
    </form>
  );
};

export default NoteForm;
