var map = L.map('map', { zoomControl: false }).setView([20.5937, 78.9629], 6);; // initial default view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // attribution: '© OpenStreetMap contributors',
}).addTo(map);

var userMarker; // store the marker globally

// Listen for location messages from React Native
// document.addEventListener("message", handleMessage);
window.addEventListener("message", (event) => {
    try {
        const loc = JSON.parse(event.data); // expects {latitude, longitude}
        sendLogsFromHTMLPage("HTML PAGE LOGS : " + loc)
        window.ReactNativeWebView.postMessage("Received in WebView: " + JSON.stringify(loc));
        if (!loc.latitude || !loc.longitude) return;

        var marker = L.icon({
            iconUrl: '../images/map-pin.png',
            iconSize: [38, 95],
            iconAnchor: [20.5937, 78.9629],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });

        if (!userMarker) {
            userMarker = L.marker([loc.latitude, loc.longitude], { icon: marker }).addTo(map)
                .bindPopup("You are here").openPopup();
        } else {
            userMarker.setLatLng([loc.latitude, loc.longitude]);
        }

        map.setView([loc.latitude, loc.longitude], 15);
    } catch (e) {
        console.error("Failed to parse location:", e);
    }
});