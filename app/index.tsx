import * as Location from 'expo-location';
// import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import { WebView } from 'react-native-webview';

import { router } from 'expo-router';

import { Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

 export default function Index() {

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const cancelRef = useRef(false);
  const timerRef = useRef(null);
  const webviewRef = useRef<WebView>(null);
  const webviewReady = useRef(false);

//   const [expoPushToken, setExpoPushToken] = useState(''); 

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => {
//         setExpoPushToken(token);
//         console.log(expoPushToken);
//     });

//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       console.log("Notification received:", notification);
//     });

//     return () => subscription.remove();
//   }, []);

//   useEffect(() => {
//     AppState.addEventListener("change", (nextState) => {
//     if (nextState === "active") {
//         startBackgroundLocation();
//     }
//     });
      
//     return () => {
//       stopBackgroundLocation();
//     };
//   }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('PAGE LOGS : Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log("PAGE LOGS : ForgroundLocationServiceLocation : ",loc);

    })();
  }, []);
     
      const INJECTED_JAVASCRIPT = `
      (function() {
        window.receiveAppMessage = function(data) {
          // Process the data received from the native app
          console.log(JSON.stringify(data));
          // You can update the DOM, call other functions, etc.
          window.appData = data; // store it globally
        };
      })();
    `;
     
     const injectData = (myData: { latitude: number; longitude: number }) => {
        const script = `
          if (window.receiveAppMessage) {
            console.log("[Native] " + "receive app message is initialized in window")
            window.receiveAppMessage(${JSON.stringify(myData)});
          }
          true; // Required for injectJavaScript to work correctly
        `;
        webviewRef.current.injectJavaScript(script);
      };

     return (
      <SafeAreaView style={{...styles.container, borderWidth: 0, borderColor: 'white'}}>
             
      <View style={styles.container}>
          
          <View style={{ margin:25, width: 40, height: 40, position: 'absolute', backgroundColor: 'white', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
              <Menu size={ 20} />
          </View>
      <View style={styles.mapContainer}> 
      {location ? (

        <WebView
        ref={webviewRef}
        source={require('../assets/html_pages/index2.html')}
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT} // Initial injection for setting up the receiver
        originWhitelist={["*"]}
        onLoadEnd={() => injectData({...location})}
        // onLoadEnd={() => injectData({latitude: 0, longitude: 0})}
        onMessage={(event) => {
            try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'console') {
                // Log HTML console messages in your Metro/Expo console
                if (data.level === 'error') console.error('[WebView]', data.message);
                else if (data.level === 'warn') console.warn('[WebView]', data.message);
                else console.log('[WebView]', data.message);
            } else {
                // Handle other app messages (like location updates)
                console.log('[WebView message]', data);
            }
            } catch (e) {
            console.log('Raw WebView message:', event.nativeEvent.data);
            }
        }}
                             
                            
        // onLoadEnd={injectData}
        />
      ) : (
        <Text style={styles.loading}>Loading location...</Text>
      )}
      </View>

          <TouchableOpacity style={styles.sosButton}
            //   onPress={sendSOS}
                onPress={() => {
                    fetch("http://10.180.176.92:5000/location/addlocation", {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...location }),
                    })
                }}

          >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelSOS}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sending Alert!</Text>
            <Text style={styles.modalMsg}>
              This will send your location to nearby users in {countdown} seconds unless you cancel.
            </Text>
            <View style={styles.modalButtons}>
              <Button title="OK" onPress={confirmSOS} />
              <Button title={`Cancel (${countdown})`} onPress={cancelSOS} color="red" />
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1},
  mapContainer: {
      marginLeft: "auto",
      marginRight: "auto",
      height: "100%",
      width: "100%",
      borderWidth: 2,
      borderColor: "#b8bab9",
      },

  loading: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  sosButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: "-50%" }],
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 10,
  },
  sosText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMsg: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
