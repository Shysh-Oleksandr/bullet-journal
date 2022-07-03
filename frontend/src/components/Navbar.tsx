import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/user/userSlice';
import { IoMdMenu } from 'react-icons/io';
import { updateUserData } from './../features/user/userSlice';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((store) => store.user);

    const Logout = () => {
        dispatch(logout());
    };

    return (
        <div
            className={`flex sticky top-0 left-0 right-0 z-50 shadow-lg items-center transition-all duration-500 justify-between ${
                user.isSidebarShown ? 'small-padding-x' : 'padding-x'
            } py-4 text-white bg-cyan-700 h-[65px]`}
        >
            <button
                onClick={() => dispatch(updateUserData({ oldUser: user, newUserData: { isSidebarShown: !user.isSidebarShown } }))}
                className="text-4xl transition-colors absolute left-4 top-1/2 -translate-y-1/2 hover:text-cyan-100"
            >
                <IoMdMenu />
            </button>
            <Link to={'/'} className="text-3xl font-bold cursor-pointer transition-colors hover:text-cyan-100">
                Bullet Journal
            </Link>
            <div className="flex items-center">
                <Link to={'/edit'} className="text-3xl cursor-pointer transition-all hover:rotate-90 hover:opacity-80 duration-500">
                    <BsPlusLg />
                </Link>
                <span className="mx-4 text-4xl">|</span>
                <button onClick={() => Logout()} className="text-2xl cursor-pointer transition-all bg-cyan-500 px-4 py-1 rounded-md hover:bg-cyan-600 hover:shadow-sm">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
