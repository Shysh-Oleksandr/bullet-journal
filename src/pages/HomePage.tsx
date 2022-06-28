import React from 'react';
import Notes from '../components/Notes';
import IPageProps from './../interfaces/page';

const HomePage = (props: IPageProps) => {
    return (
        <div>
            <Notes />
        </div>
    );
};

export default HomePage;
