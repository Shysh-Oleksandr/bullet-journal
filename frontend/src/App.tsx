import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import AuthRoute from './components/AuthRoute';
import Loading from './components/UI/Loading';
import Navbar from './components/Navbar';
import logging from './config/logging';
import routes from './config/routes';
import { login, logout } from './features/user/userSlice';
import { Validate } from './modules/auth';
import Alert from './components/UI/Alert';

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const { error, success } = useAppSelector((store) => store.journal);

    useEffect(() => {
        setTimeout(() => {
            checkLocalStorageForCredentials();
        }, 100);
    }, []);

    /**
     * Check to see if we have a token.
     * If we do, verify it with the backend.
     * If not, we are logged out initially.
     */
    function checkLocalStorageForCredentials() {
        const fire_token = localStorage.getItem('fire_token');

        if (fire_token === null) {
            dispatch(logout());
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        } else {
            return Validate(fire_token, (error, user) => {
                if (error) {
                    logging.error(error);
                    dispatch(logout());
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 100);
                } else if (user) {
                    dispatch(login({ user, fire_token }));
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 100);
                }
            });
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <Loading scaleSize={2} />
            </div>
        );
    }

    return (
        <Router>
            <div className="app text-center w-full h-full bg-slate-300">
                <Routes>
                    {routes.map((route, index) => {
                        if (route.auth) {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <AuthRoute>
                                            <route.component {...route.props} />
                                        </AuthRoute>
                                    }
                                />
                            );
                        }
                        return <Route key={index} path={route.path} element={<route.component {...route.props} />} />;
                    })}
                </Routes>
                <Alert message={error} isError={true} />
                <Alert message={success} isError={false} />
            </div>
        </Router>
    );
}

export default App;
