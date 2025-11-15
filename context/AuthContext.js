import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithCredential, signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import { createContext, useContext, useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function handleAuthStateChanged(user) {
        console.log("user:", user)
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '568008744021-54s2csht7gmdo7slao40t0e0lh0k16g5.apps.googleusercontent.com'
        })
    }, [])

    const logout = async () => {
        await signOut(getAuth()).then(() => console.log('User signed out!'));
        console.log("user:", user)
    }

    async function loginWithGoogle() {
        let idToken;
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();
        console.log(signInResult)
        // Try the new style of google-sign in result, from v13+ of that module
        idToken = signInResult.data?.idToken;
        if (!idToken) {
            // if you are using older versions of google-signin, try old style result
            idToken = signInResult.idToken;
        }
        if (!idToken) {
            throw new Error('No ID token found');
        }

        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);

        // Sign-in the user with the credential
        return signInWithCredential(getAuth(), googleCredential);
    }


    return (
        <AuthContext.Provider value={{ user, initializing, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
