import React from 'react';
import { useAppSelector } from '../../../store/helpers/storeHooks';
import { getUserId } from '../userSlice';
import logging from '../../../config/logging';
import { Navigate } from 'react-router-dom';

interface IAuthRouteProps {
  children: JSX.Element;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;

  const userId = useAppSelector(getUserId);

  if (!userId) {
    logging.info('Unauthorized, redirecting...');
    return <Navigate to='/login' />;
  } else {
    return <>{children}</>;
  }
};

export default AuthRoute;
