import React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/user/userSlice';
import { IoMdMenu } from 'react-icons/io';
import { updateUserData } from './../features/user/userSlice';
import { useWindowSize } from '../hooks';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((store) => store.user);
    const [width] = useWindowSize();

    const Logout = () => {
        dispatch(logout());
    };

    return (
        <div
            className={`flex sticky top-0 left-0 right-0 z-[999] shadow-lg items-center transition-all duration-500 justify-between ${
                user.isSidebarShown && width > 767 ? 'small-padding-x' : 'padding-x'
            } py-4 text-white bg-cyan-700 sm:h-[65px] h-[50px]`}
        >
            <button
                onClick={() => dispatch(updateUserData({ oldUser: user, newUserData: { isSidebarShown: !user.isSidebarShown } }))}
                className={`text-4xl transition-colors absolute left-4 top-1/2 -translate-y-1/2 hover:text-cyan-100`}
            >
                <IoMdMenu />
            </button>
            <Link to={'/'} className="lg:text-3xl text-2xl font-bold cursor-pointer transition-colors hover:text-cyan-100">
                <span className="sm:block hidden md:ml-4">Bullet Journal</span>
                <img className="sm:hidden block ml-9 w-9 h-9 transition-opacity hover:opacity-90" src="/favicon.png" alt="Journal logo" />
            </Link>
            <div className="flex items-center">
                <Link to={'/edit'} className="sm:text-3xl text-2xl cursor-pointer transition-all hover:rotate-90 hover:opacity-80 duration-500">
                    <BsPlusLg />
                </Link>
                <span className="sm:mx-4 mx-3 text-4xl">|</span>
                <button onClick={() => Logout()} className="sm:text-2xl text-xl cursor-pointer transition-all bg-cyan-500 sm:px-4 px-3 py-1 rounded-md hover:bg-cyan-600 hover:shadow-sm">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
