import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthRoute from './components/auth/AuthRoute';
import Alert from './components/UI/Alert';
import Loading from './components/UI/Loading';
import logging from './config/logging';
import routes from './config/routes';
import { getIsAuthenticated, logout } from './features/user/userSlice';
import { useAppDispatch, useAppSelector } from './store/helpers/storeHooks';
import { authApi } from './features/user/userApi';

function App() {
  const [validateToken] = authApi.useLazyValidateTokenQuery();

  const dispatch = useAppDispatch();

  const { error, success } = useAppSelector((store) => store.journal);
  const isAuthenticated = useAppSelector(getIsAuthenticated);

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check to see if we have a token.
   * If not, we are logged out initially,
   * If we do, verify it with the backend.
   */
  const checkLocalStorageForCredentials = useCallback(
    async () => {
      const fire_token = localStorage.getItem('fire_token');
      const uid = localStorage.getItem('uid');

      const triggerLogout = () => {
        dispatch(logout());
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }

      if (!fire_token || !uid) {
        triggerLogout()

        return;
      }

      try {
        const validateResponse = await validateToken({ fire_token, uid })

        if (!validateResponse.data?.user) {
          triggerLogout();
        }

      } catch (error) {
        logging.error(error);
        triggerLogout();
      }
      finally {
        setIsLoading(false);
      }
    },
    [dispatch, validateToken],
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
