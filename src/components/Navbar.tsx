import React from "react";
import { BsPlusLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-32 py-4 text-white bg-cyan-700">
      <h2
        onClick={() => navigate("/")}
        className="text-3xl font-bold cursor-pointer"
      >
        Bullet Journal
      </h2>
      <span
        onClick={() => navigate(`/create`)}
        className="text-3xl cursor-pointer transition-all hover:rotate-180 hover:opacity-80 duration-500"
      >
        <BsPlusLg />
      </span>
    </div>
  );
};

export default Navbar;
