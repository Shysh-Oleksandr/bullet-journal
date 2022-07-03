import React from 'react';
import Navbar from '../components/Navbar';
import NoteForm from '../components/note/NoteForm';
import Sidebar from '../components/sidebar/Sidebar';

const EditPage = () => {
    return (
        <div className="fl">
            <Sidebar />
            <div>
                <Navbar />
                <NoteForm />
            </div>
        </div>
    );
};

export default EditPage;
