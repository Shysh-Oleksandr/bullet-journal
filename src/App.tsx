import React from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Notes from "./components/Notes";

function App() {
  const dispatch = useAppDispatch();
  return (
    <div className="app text-center w-full h-full pt-8 bg-slate-300">
      <Notes />
    </div>
  );
}

export default App;
