import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import routes from './config/routes';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { initialState as initialUserState, logout } from './features/user/userSlice';
import Loading from './components/Loading';
import AuthRoute from './components/AuthRoute';
//  "homepage": "http://shysh-oleksandr.github.io/bullet-journal",

function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((store) => store.user);
    const isAuthorized = user._id !== '';

    const [authStage, setAuthStage] = useState('Checkign localstorage');
    useEffect(() => {
        setTimeout(() => {
            checkLocalStorageForCredentials();
        }, 1000);
    }, []);

    /**
     * Check to see if we have a token.
     * If we do, verify it with the backend.
     * If not, we are logged out initially.
     */
    function checkLocalStorageForCredentials() {
        setAuthStage('Checking credentionals');

        const fire_token = localStorage.getItem('fire_token');

        if (fire_token === null) {
            dispatch(logout(initialUserState));
            setAuthStage('No crede found.');
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } else {
            // Validate with backedn
            setAuthStage('crede found.');

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
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
                {isAuthorized && <Navbar />}
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

                    {/* <Route path="*" element={<HomePage />} />  */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
