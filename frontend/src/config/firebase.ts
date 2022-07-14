import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import config from './config';

const Firebase = firebase.initializeApp(config.firebase);
export const Providers = {
    google: new firebase.auth.GoogleAuthProvider(),
    github: new firebase.auth.GithubAuthProvider()
};

export const auth = firebase.auth();

export default Firebase;
