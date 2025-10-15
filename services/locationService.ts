import * as Location from "expo-location";
import { GEOFENCE_TASK_NAME, LOCATION_TASK_NAME } from "../utils/constants";

export async function startBackgroundLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("BGC: Foreground location permission denied");
    return;
  }

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    console.log("BGC: Background location permission denied");
    return;
  }

  let location = await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 100, // only update if moved >100mr
    deferredUpdatesInterval: 60000, // throttle updates
    foregroundService: {
      notificationTitle: "Location Tracking",
      notificationBody: "Running in background",
    },
  });
    
  await console.log("BGC: location:" + location);

  console.log("BGC: ✅ Background location tracking started");
}

export async function stopBackgroundLocation() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("🛑 Background location tracking stopped");
}

export async function startGeofence(latitude: number, longitude: number, radius = 200) {
  await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, [
    {
      identifier: "custom-region",
      latitude,
      longitude,
      radius,
      notifyOnEnter: false,
      notifyOnExit: true,
    },
  ]);

  console.log(`BGC:  ✅ Geofence started at [${latitude}, ${longitude}] with radius ${radius}m`);
}

export async function stopGeofence() {
  await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
  console.log("BGC: 🛑 Geofence stopped");
}
