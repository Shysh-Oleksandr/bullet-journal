import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="app text-center w-full h-full bg-slate-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
