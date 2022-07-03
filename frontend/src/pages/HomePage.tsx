import React from 'react';
import Notes from '../components/note/Notes';
import Navbar from './../components/Navbar';
import Sidebar from '../components/sidebar/Sidebar';

const HomePage = () => {
    return (
        <div className="fl">
            <Sidebar />
            <div>
                <Navbar />
                <Notes />
            </div>
        </div>
    );
};

export default HomePage;
