import React from 'react';
import NoteForm from '../components/NoteForm';
import IPageProps from '../interfaces/page';

const EditPage = (props: IPageProps) => {
    return (
        <div>
            <NoteForm />
        </div>
    );
};

export default EditPage;
