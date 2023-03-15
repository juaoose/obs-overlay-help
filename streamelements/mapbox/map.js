const pullKey = "<YOUR_RTIRL_PULL_KEY>";
const mapboxToken = "<YOUR_MAPBOX_AT>";

var app;
var map = L.map("map").setView([0, 0], 13);
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    accessToken: mapboxToken,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,

    zoom: 13,
  }
).addTo(map);

// Setting this through options does not seem to work
map.removeControl(map.zoomControl);
map.dragging.disable();

addEventListener("load", onReady);

function onReady() {
  firebase.database.INTERNAL.forceWebSockets();
  app = firebase.initializeApp(
    {
      apiKey: "AIzaSyC4L8ICZbJDufxe8bimRdB5cAulPCaYVQQ",
      databaseURL: "https://rtirl-a1d7f-default-rtdb.firebaseio.com",
      projectId: "rtirl-a1d7f",
      appId: "1:684852107701:web:d77a8ed0ee5095279a61fc",
    },
    "rtirl-api"
  );

  addLocationListener(function (location) {
    map.panTo({
      lng: location.longitude,
      lat: location.latitude,
    });
  });
}

function addLocationListener(callback) {
  return addListener("location", callback);
}

function addListener(type, callback) {
  return app
    .database()
    .ref()
    .child("pullables")
    .child(pullKey)
    .child(type)
    .on("value", function (snapshot) {
      callback(snapshot.val());
    });
}
