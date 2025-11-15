import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
      <AuthProvider>
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
            {/* <Stack.Screen name="about" options={{ title: 'About' }} /> */}
            <Stack.Screen name="Screen/contacts.page" options={{ title: 'Contacts', headerTitleAlign: 'center'}}/>
            <Stack.Screen name="Screen/login.page" options={{ title: 'Login', headerTitleAlign: 'center', headerShown: false}}/>
            <Stack.Screen name="Screen/signup.page" options={{ title: 'SignUp', headerTitleAlign: 'center', headerShown: false}}/>
            <Stack.Screen name="Screen/map.page" options={{ title: 'Map', headerTitleAlign: 'center', headerShown: false}}/>
            <Stack.Screen name="Screen/pathTrace.demo.page" options={{ title: 'Map', headerTitleAlign: 'center', headerShown: false}}/>
            {/* <Stack.Screen name="signup" options={{ title: 'SignUp', headerTitleAlign: 'center'}}/> */}
        </Stack>
      </AuthProvider>
  );
}
