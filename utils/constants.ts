export const LOCATION_TASK_NAME = "background-location-task";
export const GEOFENCE_TASK_NAME = "geofence-task";
// export const leafletHTML = `
// <!DOCTYPE html>
// <html>
// <head>
//   <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
//   <style>#map{position:absolute;top:0;bottom:0;left:0;right:0;}</style>
// </head>
// <body>
//   <div id="map"></div>
//   <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//   <script>
//   window.ReactNativeWebView.postMessage("Received in WebView: " + "hello gg");
//     var map = L.map('map').setView([0,0], 3); // initial default view
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(map);

//     var userMarker; // store the marker globally

//     // Listen for location messages from React Native
//     document.addEventListener("message", handleMessage);
//     window.addEventListener("message", (event) => {
//       try {
//     const loc = JSON.parse(event.data); // expects {latitude, longitude}
//     window.ReactNativeWebView.postMessage("Received in WebView: " + JSON.stringify(loc));
//     if (!loc.latitude || !loc.longitude) return;

//     if (!userMarker) {
//       userMarker = L.marker([loc.latitude, loc.longitude]).addTo(map)
//                     .bindPopup("You are here").openPopup();
//     } else {
//       userMarker.setLatLng([loc.latitude, loc.longitude]);
//     }

//     map.setView([loc.latitude, loc.longitude], 15);
//   } catch (e) {
//     console.error("Failed to parse location:", e);
//   }
//     });
//   </script>
// </body>
// </html>
// `;
