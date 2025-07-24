// import React, { useEffect, useState } from 'react';
// import { Button, View, Text } from 'react-native';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { auth } from '../firebase';
// import { signInWithCredential, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

// WebBrowser.maybeCompleteAuthSession();

// export default function LoginScreen({ navigation }) {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: '120264711969-5774jit55qm4acv6k7vg6o4224n7np9m.apps.googleusercontent.com',
//     iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
//     webClientId: '120264711969-gn6chg3931ekqsbj434e191ev7a9tsgm.apps.googleusercontent.com',
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;
//       const credential = GoogleAuthProvider.credential(id_token);
//       signInWithCredential(auth, credential);
//     }
//   }, [response]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         navigation.replace('Home'); // replace with your SOS map screen
//       }
//     });
//     return unsubscribe;
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome! Please sign in.</Text>
//       <Button title="Sign in with Google" disabled={!request} onPress={() => promptAsync()} />
//     </View>
//   );
// }
