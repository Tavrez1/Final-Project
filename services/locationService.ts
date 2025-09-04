import * as Location from "expo-location";
import { GEOFENCE_TASK_NAME, LOCATION_TASK_NAME } from "../utils/constants";

export async function startBackgroundLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Foreground location permission denied");
    return;
  }

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    console.log("Background location permission denied");
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 100, // only update if moved >100m
    deferredUpdatesInterval: 60000, // throttle updates
    foregroundService: {
      notificationTitle: "Location Tracking",
      notificationBody: "Running in background",
    },
  });

  console.log("✅ Background location tracking started");
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

  console.log(`✅ Geofence started at [${latitude}, ${longitude}] with radius ${radius}m`);
}

export async function stopGeofence() {
  await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
  console.log("🛑 Geofence stopped");
}
