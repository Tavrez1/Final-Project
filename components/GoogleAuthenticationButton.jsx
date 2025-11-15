import { Image, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext.js';

import google_img from '../assets/images/google.png';




const GoogleAuthenticationButton = () => {

    const { user, initializing, loginWithGoogle, logout } = useAuth()


    if (initializing) {
        return (
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text>Loading ...</Text>
            </View>
        )
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
                    onPress={() => loginWithGoogle()}
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
                    onPress={() => logout()}
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
