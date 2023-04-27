const pullKey = "<YOUR_RTIRL_PULL_KEY>";
const format = "tt";
const lang = "en";

var app;

var i = 0;
var j = 0;
var latestLocation = null;
var zoneId = null;

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
    latestLocation = location;
    refreshTzOffset();
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

function refreshTzOffset() {
  GeoTZ.find(latestLocation.latitude, latestLocation.longitude).then(function (
    data
  ) {
    zoneId = data.length > 0 ? data[0] : "UTC";
  });
}

setInterval(function () {
  if (zoneId == null) {
    return;
  }
  document.getElementById("time").innerText = luxon.DateTime.now()
    .setZone(zoneId)
    .setLocale(lang)
    .toFormat(format);
}, 1000);
