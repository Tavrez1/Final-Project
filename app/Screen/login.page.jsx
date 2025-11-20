import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { registerRootComponent } from 'expo';
import { BlurView } from "expo-blur";
import { Link, Redirect } from "expo-router";
import { useState } from 'react';
import { ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import bg_img from "../../assets/images/girl_alone.png";
import GoogleAuthenticationButton from "../../components/GoogleAuthenticationButton";
import { useAuth } from '../../context/AuthContext';


export default function LoginPage() {
    const { user } = useAuth()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return alert("Please fill all fields");

        setLoading(true);

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in successfully!");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }

        setLoading(false);
    };


    if (!user) {
        return (
            <ImageBackground
                source={bg_img}
                style={{ width: "100%", flex: 1, justifyContent: "center" }}
                resizeMode="cover"
            >
                <View style={{ width: "100%", gap: 20, background: `url(${bg_img})`, paddingHorizontal: 20, }}>
                    <BlurView intensity={100} tint="dark" style={{ padding: 30, borderRadius: 20, gap: 20, overflow: 'hidden', }}>

                        {/* Username */}
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#ccc"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.3)",
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: "white",
                            }}
                        />

                        {/* Password */}
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#ccc"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={{
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.3)",
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: "white",
                            }}
                        />

                        {/* Forgot password */}
                        <Link href="/forgot-password">
                            <Text
                                style={{
                                    color: "#4DA6FF",
                                    textAlign: "right",
                                    marginTop: -10,
                                    marginBottom: 10,
                                }}
                            >
                                Forgot Your Password?
                            </Text>
                        </Link>

                        {/* Login Button */}
                        <Pressable
                            onPress={handleLogin}
                            disabled={loading}
                            style={{
                                backgroundColor: "white",
                                paddingVertical: 15,
                                borderRadius: 10,
                                alignItems: "center",
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
                                {loading ? "Logging in..." : "Login"}
                            </Text>
                        </Pressable>

                        <GoogleAuthenticationButton />

                        {/* Bottom text */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ color: "white" }}>Don’t have an account? </Text>
                            <Link href="./signup.page">
                                <Text style={{ color: "#4DA6FF", fontWeight: "bold" }}>
                                    Sign Up
                                </Text>
                            </Link>
                        </View>

                    </BlurView>
                </View>
            </ImageBackground >
            // </LinearGradient>
        );
    }

    return <Redirect href="../index.tsx" />
}

registerRootComponent(LoginPage);