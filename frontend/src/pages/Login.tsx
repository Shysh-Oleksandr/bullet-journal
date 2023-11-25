import firebase from 'firebase/compat/app';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import InfoMessage from '../components/UI/InfoMessage';
import Loading from '../components/UI/Loading';
import { Providers } from '../config/firebase';
import logging from '../config/logging';
import { authApi } from '../features/user/userApi';
import { getAuthErrorMsg, getIsAuthenticating } from '../features/user/userSlice';
import { useAppSelector } from '../store/helpers/storeHooks';
import { auth } from '../config/firebase';
import CenterPiece from '../features/user/components/CenterPiece';
import LoginBtn from '../features/user/components/LoginBtn';

const SocialMediaPopup = (provider: firebase.auth.AuthProvider) =>
  new Promise<firebase.auth.UserCredential>((resolve, reject) => {
    auth.signInWithPopup(provider)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

const LoginPage = () => {
  const isAuthenticating = useAppSelector(getIsAuthenticating);
  const errorMsg = useAppSelector(getAuthErrorMsg);

  const [login] = authApi.useLazyLoginQuery();

  const navigate = useNavigate();

  const title = window.location.pathname.includes('login') ? 'Login' : 'Sign Up';

  const SignInWithSocialMedia = async (provider: firebase.auth.AuthProvider) => {
    try {
      const response = await SocialMediaPopup(provider);

      const user = response?.user;

      if (!user) {
        logging.error("No user found");

        return;
      }

      const { uid } = user;

      const fire_token = await user.getIdToken();
      const loginResponse = await login({ fire_token, uid });

      if (loginResponse.data?.user) {
        navigate('/');
      }
    } catch (error) {
      logging.error(error);
    }
  };

  return (
    <CenterPiece>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white md:px-12 sm:px-8 px-4 py-8 lg:w-[40vw] md:w-[55vw] sm:w-[65vw] w-[90vw] rounded-lg shadow-xl">
          <div className="sm:text-5xl text-4xl font-semibold text-center mt-4 mb-8">{title}</div>
          <div className="text-center">
            <LoginBtn
              className="disabled:bg-orange-900 bg-orange-600  hover:bg-orange-700"
              authenticating={isAuthenticating}
              icon={<BsGoogle />}
              onclick={() => SignInWithSocialMedia(Providers.google)}
              providerName="Google"
            />
            <LoginBtn
              className="disabled:bg-gray-900 bg-gray-600  hover:bg-gray-700"
              authenticating={isAuthenticating}
              icon={<BsGithub />}
              onclick={() => SignInWithSocialMedia(Providers.github)}
              providerName="Github"
            />
            <InfoMessage message={errorMsg} isError={true} />
            {isAuthenticating && <Loading scaleSize={1.2} innerClassName='!pt-12 !pb-10' />}
          </div>
        </div>
      </div>
    </CenterPiece>
  );
};

export default LoginPage;
