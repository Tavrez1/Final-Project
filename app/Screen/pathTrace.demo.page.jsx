import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";



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

// ----------------------------
// Kalman 1D (speed) - lightweight adaptive implementation
// ----------------------------
class Kalman1D {
    constructor({ q = 0.1, r = 1, initial = 0 } = {}) {
        // state: estimated speed (m/s)
        this.x = initial;
        // error covariance
        this.P = 1;
        this.Q = q; // process noise
        this.R = r; // measurement noise
    }

    setQ(q) {
        this.Q = q;
    }

    setR(r) {
        this.R = r;
    }

    predict() {
        // state has simple model: x_k = x_{k-1} (we assume speed changes via process noise)
        // P = P + Q
        this.P = this.P + this.Q;
    }

    update(z) {
        // z: measurement (raw speed)
        // K = P / (P + R)
        const K = this.P / (this.P + this.R);
        // x = x + K * (z - x)
        this.x = this.x + K * (z - this.x);
        // P = (1 - K) * P
        this.P = (1 - K) * this.P;
        return this.x;
    }
}

export default function PathTracerDemoPage() {

    const webviewRef = useRef(null);
    const [pathHistory, setPathHistory] = useState([]);
    const [heading, setHeading] = useState(0);

    // ---- NEW STATES FOR SPEED ----
    const [speed, setSpeed] = useState(0);
    const lastPointRef = useRef(null);

    // keep a ref for latest heading so GPS loop can access it if needed
    const headingRef = useRef(0);

    // Kalman filter ref
    const kfRef = useRef(null);

    // buffer to compute acceleration-based Q adaptation (keep last filtered speed)
    const prevFilteredSpeedRef = useRef(0);
    const prevTimeRef = useRef(null);

    // ------------------------------------
    // Magnetometer (continuous heading)
    // ------------------------------------
    useEffect(() => {
        let subscription = Magnetometer.addListener((data) => {
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            angle = angle >= 0 ? angle : angle + 360;

            setHeading(angle);
            headingRef.current = angle;

            // send heading-only update
            if (webviewRef.current) {
                webviewRef.current.postMessage(JSON.stringify({ heading: angle }));
            }
        });

        Magnetometer.setUpdateInterval(100); // smooth rotation
        return () => subscription?.remove();
    }, []);

    // initialize Kalman once
    useEffect(() => {
        if (!kfRef.current) {
            // initial small Q, R — we'll adapt Q and R dynamically per measurement
            kfRef.current = new Kalman1D({ q: 0.1, r: 1, initial: 0 });
        }
    }, []);

    // ------------------------------------
    // GPS tracking + adaptive Kalman speed
    // ------------------------------------
    useEffect(() => {
        let watcher = null;

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            watcher = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    distanceInterval: 1,
                    timeInterval: 100,
                },
                (pos) => {
                    const newPoint = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy ?? 999, // use if available
                    };

                    // ---- SPEED CALCULATION (raw) ----
                    let rawSpeed = 0; // default 0 m/s
                    const now = Date.now();

                    if (lastPointRef.current) {
                        const prev = lastPointRef.current;
                        const dist = distanceInMeters(prev.lat, prev.lng, newPoint.lat, newPoint.lng);
                        const timeSec = (now - prev.time) / 1000;

                        rawSpeed = timeSec > 0 ? dist / timeSec : 0; // m/s

                        // Ignore tiny movements (GPS jitter)
                        if (dist < 0.5) {
                            rawSpeed = 0;
                        }

                        // If GPS reported accuracy is poor, ignore this measurement (treat rawSpeed as 0)
                        if (newPoint.accuracy > 25) { // you can tune this threshold
                            rawSpeed = 0;
                        }
                    }

                    // ---- ADAPTIVE KALMAN STEPS ----
                    const kf = kfRef.current;

                    // compute dt for acceleration-based adaptation
                    const prevTime = prevTimeRef.current ?? now;
                    const dt = Math.max(0.001, (now - prevTime) / 1000); // seconds
                    prevTimeRef.current = now;

                    // approximate acceleration (based on previous filtered value)
                    const prevFiltered = prevFilteredSpeedRef.current ?? 0;
                    const approxAcc = (rawSpeed - prevFiltered) / dt; // m/s^2

                    // adapt process noise Q based on acceleration magnitude (more accel -> larger Q)
                    // baseQ small (stable), add term proportional to |acc|
                    const baseQ = 0.05; // base process noise
                    const accFactor = Math.min(Math.abs(approxAcc) * 0.5, 5); // cap influence
                    let adaptiveQ = baseQ + accFactor;

                    // also increase measurement noise R when GPS accuracy is poor (less trust in measurement)
                    const baseR = 0.5; // base measurement noise
                    // map accuracy (meters) to R: higher accuracy -> higher R
                    const gpsAccuracy = newPoint.accuracy ?? 10;
                    const adaptiveR = baseR + Math.min(gpsAccuracy / 10, 10); // cap

                    // set filter params
                    if (kf) {
                        kf.setQ(adaptiveQ);
                        kf.setR(adaptiveR);
                        kf.predict();
                        const filtered = kf.update(rawSpeed);
                        prevFilteredSpeedRef.current = filtered;

                        // update React state with filtered speed
                        setSpeed(filtered);

                        // update lastPoint and path
                        lastPointRef.current = { ...newPoint, time: now };

                        setPathHistory((prev) => {
                            const newHistory = [...prev, { lat: newPoint.lat, lng: newPoint.lng, timestamp: now }];

                            // send path + filtered speed
                            if (webviewRef.current) {
                                webviewRef.current.postMessage(
                                    JSON.stringify({
                                        path: newHistory,
                                        speed: filtered, // filtered m/s
                                    })
                                );
                            }

                            return newHistory;
                        });
                    } else {
                        // fallback: no Kalman (shouldn't happen)
                        setSpeed(rawSpeed);
                        lastPointRef.current = { ...newPoint, time: now };
                        setPathHistory((prev) => {
                            const newHistory = [...prev, { lat: newPoint.lat, lng: newPoint.lng, timestamp: now }];
                            if (webviewRef.current) {
                                webviewRef.current.postMessage(JSON.stringify({ path: newHistory, speed: rawSpeed }));
                            }
                            return newHistory;
                        });
                    }
                }
            );
        })();

        return () => {
            if (watcher && watcher.remove) watcher.remove();
        };
    }, []); // run once

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webviewRef}
                originWhitelist={["*"]}
                source={require('../../assets/html_pages/pathTrace.demo.html')}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={(event) => {
                    console.log("[MapTracer] ", event.nativeEvent.data);
                }}
            />
        </View>
    );
}
