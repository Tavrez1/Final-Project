import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithCredential, signOut } from '@react-native-firebase/auth';
import {
    GoogleSignin
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import google_img from '../assets/images/google.png';




const GoogleAuthenticationButton = () => {

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

    const mySignOut = async () => {
        await signOut(getAuth()).then(() => console.log('User signed out!'));
        console.log("user:", user)
    }

    async function signIn() {
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


    if (!user || true) {
        return (
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Pressable
                    onPress={() => signIn()}
                    style={{
                        marginTop: 10,
                        padding: 12,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        backgroundColor: "white",
                        width: '100%',
                    }}
                >
                    <Image
                        source={google_img}
                        style={{ width: 22, height: 22, marginRight: 10 }}
                    />
                    <Text style={{ fontWeight: "bold" }}>Sign Up with Google</Text>
                </Pressable>

                {user && (<Pressable
                    onPress={() => mySignOut()}
                    style={{
                        marginTop: 10,
                        padding: 12,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        backgroundColor: "white",
                        width: '100%',
                    }}
                >
                    <Image
                        source={google_img}
                        style={{ width: 22, height: 22, marginRight: 10 }}
                    />
                    <Text style={{ fontWeight: "bold" }}>Sign Out</Text>
                </Pressable>)
                }
            </View>
        );
    } else {
        // return <Redirect href="./" />;
    }
};

export default GoogleAuthenticationButton;
