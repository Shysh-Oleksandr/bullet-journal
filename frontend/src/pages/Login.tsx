import firebase from 'firebase/compat/app';
import React, { useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import CenterPiece from '../components/auth/CenterPiece';
import LoginBtn from '../components/auth/LoginBtn';
import InfoMessage from '../components/UI/InfoMessage';
import Loading from '../components/UI/Loading';
import { Providers } from '../config/firebase';
import logging from '../config/logging';
import { login } from '../features/user/userSlice';
import { Authenticate, SignInWithSocialMedia as SocialMediaPopup } from '../modules/auth';

const LoginPage = () => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isLogin = window.location.pathname.includes('login');

  const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
    if (error !== '') setError('');
    setAuthenticating(true);

    SocialMediaPopup(provider)
      .then(async (result) => {
        let user = result.user;
        if (user) {
          let uid = user.uid;

          try {
            let fire_token = await user.getIdToken(true);

            Authenticate(uid, fire_token, (error, _user) => {
              if (error) {
                setError(error);
                setAuthenticating(false);
              } else if (_user) {
                dispatch(login({ user: _user, fire_token }));
                navigate('/');
              }
            });
          } catch (error) {
            setError('Invalid token.');
            logging.error(error);
            setAuthenticating(false);
          }
        } else {
          setError('The identify provider is missing a lot of the necessary information. Please try another account or provider.');
          setAuthenticating(false);
        }
      })
      .catch((error) => {
        setAuthenticating(false);
        setError(error.message);
      });
  };

  return (
    <CenterPiece>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white md:px-12 sm:px-8 px-4 py-8 lg:w-[40vw] md:w-[55vw] sm:w-[65vw] w-[90vw] rounded-lg shadow-xl">
          <div className="sm:text-5xl text-4xl font-semibold text-center mt-4 mb-8">{isLogin ? 'Login' : 'Sign Up'}</div>
          <div className="text-center">
            <LoginBtn
              className="disabled:bg-orange-900 bg-orange-600  hover:bg-orange-700"
              authenticating={authenticating}
              isLogin={isLogin}
              icon={<BsGoogle />}
              onclick={() => SignInWithSocialMedia(Providers.google)}
              providerName="Google"
            />
            <LoginBtn
              className="disabled:bg-gray-900 bg-gray-600  hover:bg-gray-700"
              authenticating={authenticating}
              isLogin={isLogin}
              icon={<BsGithub />}
              onclick={() => SignInWithSocialMedia(Providers.github)}
              providerName="Github"
            />
            <InfoMessage message={error} isError={true} />
            {authenticating && <Loading />}
          </div>
        </div>
      </div>
    </CenterPiece>
  );
};

export default LoginPage;
