import { registerRootComponent } from 'expo';
import * as Location from 'expo-location';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// import { db } from '../firebase';

 export default function Index() {
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const cancelRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

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
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        >
          <Marker coordinate={location} title="You" />
        </MapView>
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
      height: "50%",
      width: "100%",
      borderWidth: 2,
      borderColor: "#b8bab9",
      },
  map: {  flex: 1 },
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
