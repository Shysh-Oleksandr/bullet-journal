import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { initialState as initialUserState, logout } from '../features/user/userSlice';

const Navbar = () => {
    const { user } = useAppSelector((store) => store.user);
    const dispatch = useAppDispatch();

    const Logout = () => {
        dispatch(logout(initialUserState));
    };

    return (
        <div className="flex items-center justify-between px-32 py-4 text-white bg-cyan-700">
            <Link to={'/'} className="text-3xl font-bold cursor-pointer">
                Bullet Journal
            </Link>
            <div>
                {user._id === '' ? (
                    <div>
                        <Link to={'/login'} className="text-3xl cursor-pointer transition-all hover:rotate-180 hover:opacity-80 duration-500">
                            Login
                        </Link>
                        <span className="mx-2 text-3xl">|</span>
                        <Link to={'/register'} className="text-3xl cursor-pointer transition-all hover:rotate-180 hover:opacity-80 duration-500">
                            Sign Up
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <Link to={'/edit'} className="text-3xl cursor-pointer transition-all hover:rotate-180 hover:opacity-80 duration-500">
                            <BsPlusLg />
                        </Link>
                        <span className="mx-4 text-4xl">|</span>
                        <button onClick={() => Logout()} className="text-2xl cursor-pointer transition-all bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 hover:shadow-sm">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
