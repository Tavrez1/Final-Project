// import * as Notifications from 'expo-notifications';
import React from 'react';

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/Screen/login.page" />;
}

//  export default function Index() {

//   const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
//   const [otherLocations, setOtherLocations] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [countdown, setCountdown] = useState(7);
//   const cancelRef = useRef(false);
//   const timerRef = useRef(null);
//   const webviewRef = useRef<WebView>(null);
//   const webviewReady = useRef(false);

//     useEffect(() => {
//         let isActive = true; // to stop after unmount
//         let isRequestInProgress = false; // lock to prevent overlap

//         const pollServer = async () => {
//             if (isRequestInProgress || !location) return;

//             isRequestInProgress = true;
//             try {
//             const res = await fetch(`${process.env.EXPO_PUBLIC_GET_OTHER_LOCATIONS}`, {
//                 method: "GET",
//                 headers: {
//                 "Content-Type": "application/json",
//                 },
//             });

//             const data = await res.json(); // or await res.text() if backend returns text
//             if (isActive) setOtherLocations(data);
//             console.log("✅ Location updated:", data);
//             } catch (err) {
//             console.error("❌ Error sending location:", err);
//             } finally {
//             isRequestInProgress = false;
//             // schedule the next poll after completion
//             if (isActive) {
//                 setTimeout(pollServer, 10000); // ⏳ 2 seconds interval
//             }
//             }
//         };

//         // Start first poll
//         pollServer();

//         // Cleanup when component unmounts
//         return () => {
//             isActive = false;
//         };
//     }, [location]);
     
//      useEffect(() => {
//         console.log("✅ otherLocations updated:", otherLocations);
//     }, [otherLocations]);


// useEffect(() => {
//   (async () => {
//     try {
//       // ✅ Ask for permission
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access location was denied');
//         return;
//       }

//       // ✅ Check if GPS / Location services are enabled (Android important)
//       const enabled = await Location.hasServicesEnabledAsync();
//       if (!enabled) {
//         alert('⚠️ Location services are turned OFF. Please enable GPS.');
//         return;
//       }

//       // ✅ Now get the current position safely
//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       setLocation(loc.coords);
//       console.log("✅ ForegroundLocationServiceLocation:", loc);

//     } catch (error) {
//       console.log("❌ Location error:", error);
//     }
//   })();
// }, []);

     
//       const INJECTED_JAVASCRIPT = `
//       (function() {
//         window.receiveAppMessage = function(data) {
//           // Process the data received from the native app
//           console.log(JSON.stringify(data));
//           // You can update the DOM, call other functions, etc.
//           window.appData = data; // store it globally
//         };
//       })();
//     `;
     
//      const injectData = (myData: any) => {
//         const script = `
//           if (window.receiveAppMessage) {
//             console.log("[Native] " + "receive app message is initialized in window")
//             window.receiveAppMessage(${JSON.stringify(myData)});
//           }
//           true; // Required for injectJavaScript to work correctly
//         `;
//         webviewRef.current.injectJavaScript(script);
//       };

//     useEffect(() => {
//         if (webviewRef.current && location && otherLocations) {
//             // Combine both into a single object
//             const dataToSend = { mylocation: location, otherLocations: otherLocations };
//             injectData(dataToSend);
//             console.log("📡 Injected updated data:", dataToSend);
//         }
//     }, [location, otherLocations]);

     
//      return (
//     //   <SafeAreaView style={{...styles.container, borderWidth: 0, borderColor: 'white'}}>
             
//       <View style={styles.container}>
          
//           <View style={{ margin:25, width: 40, height: 40, position: 'absolute', backgroundColor: 'white', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 10, elevation: 15}}>
//               <Menu size={20} />
//           </View>
//       <View style={styles.mapContainer}> 
//       {location ? (

//         <WebView
//         ref={webviewRef}
//         source={require('../assets/html_pages/index2.html')}
//         javaScriptEnabled={true}
//         injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT} // Initial injection for setting up the receiver
//         originWhitelist={["*"]}
//         onLoadEnd={() => injectData({mylocation: location, otherLocations: otherLocations})}
//         // onLoadEnd={() => injectData({latitude: 0, longitude: 0})}
//         onMessage={(event) => {
//             try {
//             const data = JSON.parse(event.nativeEvent.data);

//             if (data.type === 'console') {
//                 // Log HTML console messages in your Metro/Expo console
//                 if (data.level === 'error') console.error('[WebView]', data.message);
//                 else if (data.level === 'warn') console.warn('[WebView]', data.message);
//                 else console.log('[WebView]', data.message);
//             } else {
//                 // Handle other app messages (like location updates)
//                 console.log('[WebView message]', data);
//             }
//             } catch (e) {
//             console.log('Raw WebView message:', event.nativeEvent.data);
//             }
//         }}
                             
                            
//         // onLoadEnd={injectData}
//         />
//       ) : (
//         <Text style={styles.loading}>Loading location...</Text>
//       )}
//       </View>

//           <TouchableOpacity style={styles.sosButton}
//             //   onPress={sendSOS}
//                 onPress={() => {
//                     fetch(`${process.env.EXPO_PUBLIC_POST_OTHER_LOCATIONS}`, {
//                         method: 'POST',
//                         headers: {
//                         'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ ...location }),
//                     })
//                 }}

//           >
//         <Text style={styles.sosText}>SOS</Text>
//       </TouchableOpacity>

//       {/* <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={cancelSOS}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Sending Alert!</Text>
//             <Text style={styles.modalMsg}>
//               This will send your location to nearby users in {countdown} seconds unless you cancel.
//             </Text>
//             <View style={styles.modalButtons}>
//               <Button title="OK" onPress={confirmSOS} />
//               <Button title={`Cancel (${countdown})`} onPress={cancelSOS} color="red" />
//             </View>
//           </View>
//         </View>
//       </Modal> */}
//     </View>
//     //   </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1},
//   mapContainer: {
//       marginLeft: "auto",
//       marginRight: "auto",
//       height: "100%",
//       width: "100%",
//       borderWidth: 2,
//       borderColor: "#b8bab9",
//       },

//   loading: {
//     flex: 1,
//     textAlign: 'center',
//     textAlignVertical: 'center',
//   },
//   sosButton: {
//     position: 'absolute',
//     bottom: 40,
//     left: '50%',
//     transform: [{ translateX: "-50%" }],
//     backgroundColor: 'red',
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 50,
//     elevation: 10,
//   },
//   sosText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 25,
//     borderRadius: 10,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalMsg: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
// });
