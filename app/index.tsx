import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
// import { MapView } from "@maplibre/maplibre-react-native";
import { WebView } from "react-native-webview";

import { leafletHTML } from '@/utils/constants';
import { startBackgroundLocation, stopBackgroundLocation } from "../services/locationService";
import "../services/tasks";


// =================================== Push Notification============================================== Start

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    
  } else {
    alert('Must use physical device for Push Notifications');
    console.log('Must use physical device for Push Notifications');
    
  }

  return token;
}

// =================================== Push Notification============================================== End


 export default function Index() {
 

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const cancelRef = useRef(false);
  const timerRef = useRef(null);
  const webviewRef = useRef<WebView>(null);
  const webviewReady = useRef(false);

 

  // =================================== Push Notification============================================== Start

  const [expoPushToken, setExpoPushToken] = useState(''); //Notification State

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {setExpoPushToken(token);console.log(expoPushToken);
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });

    return () => subscription.remove();
  }, []);

  // =================================== Push Notification============================================== End

  //================================= Location ========================================= Start

  useEffect(() => {
    // Example: start tracking on mount
    startBackgroundLocation();

    // cleanup on unmount
    return () => {
      stopBackgroundLocation();
    };
  }, []);

  //================================= Location ========================================= End

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("hello");
      
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log("location",loc);
      
    })();
  }, []);
  useEffect(() => {
    if (location && webviewReady.current) {
      webviewRef.current?.postMessage(JSON.stringify({latitude:location.latitude,longitude:location.longitude}));
      console.log("update Location")
      console.log(typeof location.latitude, typeof location.longitude);
      
    }
    else console.log("not enough data in location",location);
    
  }, [location,webviewReady]);

  const triggerSOS = async () => {
    try {
      // await addDoc(collection(db, 'alerts'), {
      //   latitude: location.latitude,
      //   longitude: location.longitude,
      //   timestamp: serverTimestamp()
      // });
      alert("Alert Sent! Your location has been shared.");
      
    } catch (error) {
      console.log(error);
      alert("Error: Could not send alert.");
    }
  };

  const sendSOS = () => {
    cancelRef.current = false;
    Vibration.vibrate(500);
    setCountdown(7);
    setModalVisible(true);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setModalVisible(false);
          if (!cancelRef.current) {
            triggerSOS();
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    cancelRef.current = true;
    clearInterval(timerRef.current);
    setModalVisible(false);
  };

  const confirmSOS = () => {
    clearInterval(timerRef.current);
    setModalVisible(false);
    triggerSOS();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}> 
      {location ? (
//         <MapView style={{ flex: 1 }} />
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//           showsUserLocation
//         >

//           {/* <UrlTile
//           urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//           maximumZ={19}
//           flipY={false}
//           /> */}
//           {/* <Marker coordinate={location} title="You" /> */}
//         </MapView>
        <WebView
        ref={webviewRef}
        onLoad={() => {
          webviewReady.current = true;
          if (location) webviewRef.current?.postMessage(JSON.stringify({latitude:location.latitude,longitude:location.longitude}));
          console.log("update Location",JSON.stringify({latitude:location.latitude,longitude:location.longitude}))
        }}
        javaScriptEnabled={true}
        originWhitelist={["*"]}
        source={{ html: leafletHTML }}
        style={styles.map}
        onMessage={(event) => {
          console.log("Message from Leaflt:", event.nativeEvent.data);
        }}
        />
      ) : (
        <Text style={styles.loading}>Loading location...</Text>
      )}
      </View>

      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* Modal for countdown */}
      <Modal
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
      </Modal>
    </View>
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
  // map: {  flex: 1 },
  loading: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  sosButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -50 }],
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

// registerRootComponent(App);
