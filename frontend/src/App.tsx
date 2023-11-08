import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Alert from './components/UI/Alert';
import Loading from './components/UI/Loading';
import routes from './config/routes';
import { getInfoMessages } from './features/journal/journalSlice';
import AuthRoute from './features/user/components/AuthRoute';
import { useCheckLocalStorageForCredentials } from './hooks/useCheckLocalStorageForCredentials';
import { useAppSelector } from './store/helpers/storeHooks';

function App() {
  const { errorMsg, successMsg } = useAppSelector(getInfoMessages);

  const isLoading = useCheckLocalStorageForCredentials()

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
        <Alert message={errorMsg} isError anotherMessage={successMsg} />
        <Alert message={successMsg} isError={false} anotherMessage={errorMsg} />
      </div>
    </Router>
  );
}

export default App;
