import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebaseConfig';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// Define the User type if it’s not already defined
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const logout = async () => {
    try {
        await auth.signOut();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const onAuthStateChanged = (callback: (user: firebase.User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};

// Allowed email addresses
const allowedEmails = ['addison.lilholt@gmail.com', 'wife.email@domain.com'];

export const googleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        if (result.user && result.user.email && allowedEmails.includes(result.user.email)) {
            return result.user;
        }
        // If unauthorized, sign the user out and throw an error.
        await logout();
        throw new Error('Unauthorized email');
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export { auth, User }; // <-- Exporting auth and User so they can be used in other files