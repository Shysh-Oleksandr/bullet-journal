import React from 'react';
import { useAppSelector } from '../../app/hooks';
import logging from '../../config/logging';
import { Navigate } from 'react-router-dom';

interface IAuthRouteProps {
    children: JSX.Element;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
    const { children } = props;

    const { user } = useAppSelector((store) => store.user);

    if (user._id === '') {
        logging.info('Unauthorized, redirecting...');
        return <Navigate to={'/login'} />;
    } else {
        return <>{children}</>;
    }
};

export default AuthRoute;
