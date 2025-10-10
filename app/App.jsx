import { registerRootComponent } from 'expo';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Modal, Text, TouchableOpacity, Vibration, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import styles from './styles';

export default function App() {
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
        console.log(modalVisible);

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
                    >
                        <Marker coordinate={location} title={"You"}>
                        </Marker>
                        <Circle
                            center={location}
                            radius={300}
                            strokeWidth={2}
                            strokeColor="rgba(0, 0, 255, 0.2)"
                            fillColor="rgba(0, 0, 255, 0.1)"
                        />
                    </MapView>
                ) : (
                    <View>
                        <ActivityIndicator />
                        <Text style={styles.loading}>Loading location...</Text>
                    </View>
                )}
            </View>

            {/* Button */}
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


registerRootComponent(App);
