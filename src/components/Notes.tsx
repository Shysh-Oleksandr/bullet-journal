import React from "react";
import { useAppSelector } from "../app/hooks";
import { INote } from "../features/journal/journalSlice";
import "../styles/note.scss";

// interface NotesProps {
//   notes: INote[];
// }

const Notes = () => {
  const { notes } = useAppSelector((store) => store.journal);
  return (
    <div>
      {notes.map((note) => {
        return (
          <div
            className="note  mx-8 my-24"
            style={{ color: note.color }}
            key={note.id}
          ></div>
        );
      })}
    </div>
  );
};

export default Notes;
