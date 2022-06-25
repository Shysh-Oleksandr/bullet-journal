import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="flex items-center justify-between px-32 py-4 text-white bg-cyan-700">
            <Link to={'/'} className="text-3xl font-bold cursor-pointer">
                Bullet Journal
            </Link>
            <Link to={'/edit'} className="text-3xl cursor-pointer transition-all hover:rotate-180 hover:opacity-80 duration-500">
                <BsPlusLg />
            </Link>
        </div>
    );
};

export default Navbar;
