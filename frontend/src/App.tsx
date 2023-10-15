import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import AuthRoute from './components/auth/AuthRoute';
import Alert from './components/UI/Alert';
import Loading from './components/UI/Loading';
import logging from './config/logging';
import routes from './config/routes';
import { login, logout } from './features/user/userSlice';
import { Validate } from './modules/auth';

function App() {
  const dispatch = useAppDispatch();

  const { error, success } = useAppSelector((store) => store.journal);
  const isAuthenticated = useAppSelector((store) => store.user.user._id) !== '';

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check to see if we have a token.
   * If we do, verify it with the backend.
   * If not, we are logged out initially.
   */
  const checkLocalStorageForCredentials = useCallback(
    () => {
      const fire_token = localStorage.getItem('fire_token');
      const uid = localStorage.getItem('uid');

      if (!fire_token || !uid) {
        dispatch(logout());
        setTimeout(() => {
          setIsLoading(false);
        }, 100);

        return;
      }

      return Validate(uid, fire_token, (error, user, token) => {
        if (error) {
          logging.error(error);
          dispatch(logout());
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        } else if (user) {
          dispatch(login({ user, fire_token: token ?? fire_token }));

          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        }
      });
    },
    [dispatch],
  )

  useEffect(() => {
    if (isAuthenticated) return;

    setTimeout(() => {
      checkLocalStorageForCredentials();
    }, 100);
  }, [checkLocalStorageForCredentials, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading scaleSize={2} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app text-center w-full h-full">
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
        <Alert message={error} isError={true} anotherMessage={success} />
        <Alert message={success} isError={false} anotherMessage={error} />
      </div>
    </Router>
  );
}

export default App;
