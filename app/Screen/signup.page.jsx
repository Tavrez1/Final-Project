import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import { Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import bg_img from "../../assets/images/girl_alone.png";
import google_img from "../../assets/images/google.png";

export default function SignUpPage() {
    return (
        // >
        <ImageBackground
            source={bg_img}
            style={{ width: "100%", flex: 1, justifyContent: "center" }}
            resizeMode="cover"
        >
            <View style={{ width: "100%", gap: 20, background: `url(${bg_img})`, paddingHorizontal: 20, }}>
                <BlurView intensity={100} tint="dark" style={{ padding: 30, borderRadius: 20, gap: 20, overflow: 'hidden', }}>

                    {/* Full Name */}
                    <TextInput
                        placeholder="Full Name"
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

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        keyboardType="email-address"
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

                    {/* Sign Up Button */}
                    <Pressable
                        onPress={() => console.log("Signup pressed")}
                        style={{
                            backgroundColor: "white",
                            paddingVertical: 15,
                            borderRadius: 10,
                            alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
                            Sign Up
                        </Text>
                    </Pressable>

                    {/* Google Sign Up */}
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

                    {/* Redirect to Login */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 15,
                        }}
                    >
                        <Text style={{ color: "white" }}>Already have an account? </Text>
                        <Link href="./login.page">
                            <Text style={{ color: "#4DA6FF", fontWeight: "bold" }}>
                                Login
                            </Text>
                        </Link>
                    </View>
                </BlurView>
            </View>
        </ImageBackground>
    );
}
