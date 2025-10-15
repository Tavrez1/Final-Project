import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { LOCATION_TASK_NAME, GEOFENCE_TASK_NAME } from "../utils/constants";

// Background location tracking task
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TASK error:", error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    const location = locations[0];
    // console.log("📍 Background location update:", location.coords);
    // 👉 send location to server here if needed
  }
});

// Geofencing task
TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("GEOFENCE_TASK error:", error);
    return;
  }
  if (data) {
    const { eventType, region } = data as any;
    if (eventType === Location.GeofencingEventType.Exit) {
      console.log("🚶 User exited region:", region);
      // 👉 send alert / update backend
    }
  }
});
