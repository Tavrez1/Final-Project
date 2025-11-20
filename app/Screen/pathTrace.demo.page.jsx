import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const leafletHTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1, width=device-width">
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; }
  .arrow-icon {
    width: 40px;
    height: 40px;
    transform-origin: center center;
  }
</style>
</head>
<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>
  var map = L.map('map').setView([0, 0], 18);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  var pathLine = L.polyline([], { color: 'blue', weight: 4 }).addTo(map);

  var icon = L.divIcon({
    html: '<img class="arrow-icon" id="arrow" src="https://cdn-icons-png.flaticon.com/512/684/684908.png" />',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: ""
  });

  var userMarker = L.marker([0, 0], { icon: icon }).addTo(map);

  document.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    const coords = data.path.map(p => [p.lat, p.lng]);

    pathLine.setLatLngs(coords);

    if (coords.length > 0) {
      const latest = coords[coords.length - 1];
      userMarker.setLatLng(latest);
      map.setView(latest);

      // rotate arrow
      if (data.heading !== undefined) {
        const arrow = document.getElementById("arrow");
        if (arrow) {
          arrow.style.transform = "rotate(" + data.heading + "deg)";
        }
      }
    }
  });
</script>

</body>
</html>
`;


// ---- Helper functions ----

function distanceInMeters(lat1, lng1, lat2, lng2) {
    let R = 6371e3;
    let p1 = lat1 * (Math.PI / 180);
    let p2 = lat2 * (Math.PI / 180);
    let dp = (lat2 - lat1) * (Math.PI / 180);
    let dl = (lng2 - lng1) * (Math.PI / 180);

    let a =
        Math.sin(dp / 2) ** 2 +
        Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Moving Average Smoothing (5 samples)
function smoothPath(points) {
    if (points.length < 5) return points;

    const last = points.slice(-5);
    const avgLat = last.reduce((a, p) => a + p.lat, 0) / last.length;
    const avgLng = last.reduce((a, p) => a + p.lng, 0) / last.length;

    return [...points.slice(0, -1), { ...last[last.length - 1], lat: avgLat, lng: avgLng }];
}

export default function PathTracerDemoPage() {
    const webviewRef = useRef(null);
    const [pathHistory, setPathHistory] = useState([]);
    const [heading, setHeading] = useState(0);
    const lastPointRef = useRef(null);

    // ---- Compass Listener ----
    useEffect(() => {
        Magnetometer.addListener((data) => {
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            setHeading(10);
        });
    }, []);

    // ---- GPS Listener ----
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission denied");
                return;
            }

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 1,
                },
                (location) => {
                    const newPoint = {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                        accuracy: location.coords.accuracy,
                        speed: location.coords.speed, // m/s
                        timestamp: Date.now(),
                    };

                    // Accuracy Filter
                    if (newPoint.accuracy > 25) return;

                    // Deadband (minimum movement 3m)
                    if (lastPointRef.current) {
                        const d = distanceInMeters(
                            lastPointRef.current.lat,
                            lastPointRef.current.lng,
                            newPoint.lat,
                            newPoint.lng
                        );

                        if (d < 3) return; // ignore noise
                    }

                    lastPointRef.current = newPoint;

                    setPathHistory((prev) => {
                        const fiveMin = Date.now() - 5 * 60 * 1000;

                        let updated = [...prev, newPoint].filter((p) => p.timestamp >= fiveMin);

                        // Smooth
                        // updated = smoothPath(updated);

                        if (webviewRef.current) {
                            webviewRef.current.postMessage(
                                JSON.stringify({
                                    path: updated,
                                    heading,
                                    speed: (newPoint.speed * 3.6).toFixed(1), // km/h
                                })
                            );
                        }

                        return updated;
                    });
                }
            );
        })();
    }, [heading]);

    return (
        <View style={{ flex: 1 }}>
            <WebView ref={webviewRef} source={{ html: leafletHTML }} />
        </View>
    );
}
