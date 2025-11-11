import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import { Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import bg_img from "../../assets/images/girl_alone.png";
import google_img from "../../assets/images/google.png";


export default function LoginPage() {
    return (
        // <LinearGradient
        //     colors={["#141E30", "#243B55"]}
        //     style={{
        //         flex: 1,
        //         justifyContent: "center",
        //         alignItems: "center",
        //         paddingHorizontal: 20,
        //     }}
        // >
        <ImageBackground
            source={bg_img}
            style={{ width: "100%", flex: 1, justifyContent: "center" }}
            resizeMode="cover"
        >
            <View style={{ width: "100%", gap: 20, background: `url(${bg_img})`, paddingHorizontal: 20, }}>
                <BlurView intensity={100} tint="dark" style={{ padding: 30, borderRadius: 20, gap: 20, overflow: 'hidden', }}>

                    {/* Username */}
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#ccc"
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
                        secureTextEntry
                        placeholderTextColor="#ccc"
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
                        onPress={() => console.log("Login pressed")}
                        style={{
                            backgroundColor: "white",
                            paddingVertical: 15,
                            borderRadius: 10,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
                            Login
                        </Text>
                    </Pressable>

                    {/* Google Login */}
                    <Pressable
                        onPress={() => console.log("Google Signup")}
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
                        }}
                    >
                        <Image
                            source={google_img}
                            style={{ width: 22, height: 22, marginRight: 10 }}
                        />
                        <Text style={{ fontWeight: "bold" }}>Sign Up with Google</Text>
                    </Pressable>

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
