import React from 'react';
import IPageProps from './../interfaces/page';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { Authenticate, SignInWithSocialMedia as SocialMediaPopup } from './../modules/auth';
import logging from './../config/logging';
import InfoMessage from '../components/InfoMessage';
import { BsGoogle } from 'react-icons/bs';
import { Providers } from './../config/firebase';
import Loading from '../components/Loading';
import CenterPiece from './../components/CenterPiece';
import { useAppDispatch } from '../app/hooks';
import { login } from '../features/user/userSlice';

const LoginPage = (props: IPageProps) => {
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
                logging.info(result);

                let user = result.user;

                if (user) {
                    let uid = user.uid;
                    let name = user.displayName;

                    if (name) {
                        try {
                            let fire_token = await user.getIdToken();

                            Authenticate(uid, name, fire_token, (error, _user) => {
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
                        setError('The identify provider does not have name');
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
                <div className="bg-white px-12 py-8 lg:w-[33vw] md:w-[50vw] sm:w-[65vw] w-[80vw] rounded-lg shadow-xl">
                    <div className="text-5xl font-semibold text-center my-4">{isLogin ? 'Login' : 'Sign Up'}</div>
                    <div className="text-center">
                        <InfoMessage message={error} isError={true} />
                        <button
                            disabled={authenticating}
                            onClick={() => SignInWithSocialMedia(Providers.google)}
                            className="flex items-center justify-center mx-auto shadow-lg my-6 w-full px-10 font-bold py-3 rounded-lg bg-orange-600 transition-all text-white text-2xl cursor-pointer hover:bg-orange-700 hover:shadow-xl disabled:shadow-xl disabled:cursor-default disabled:bg-orange-900"
                        >
                            <span className="mr-4">
                                <BsGoogle />
                            </span>
                            <span>Sign {isLogin ? 'In' : 'Up'} with Google</span>
                        </button>
                        {authenticating && <Loading />}
                    </div>
                </div>
            </div>
        </CenterPiece>
    );
};

export default LoginPage;
