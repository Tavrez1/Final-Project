import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, initializing } = useAuth();

  // Show loader while Firebase checks login state
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // After Firebase finishes checking: redirect
  if (!user) {
    return <Redirect href="./Screen/login.page" />;
  }

//   return <Redirect href="./Screen/map.page" />;
  return <Redirect href="./Screen/pathTrace.demo.page" />;
}
