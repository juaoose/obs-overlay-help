const pullKey = "<YOUR_RTIRL_PULL_KEY>";
const temp_unit = "celsius"; // "celsius" or "fahrenheit"

var app;
var i = 0;

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
    if (!location) {
      return;
    }
    if (i++ % 50 !== 0) {
      return;
    }

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        location.latitude +
        "&longitude=" +
        location.longitude +
        "&current_weather=true" +
        "&temperature_unit=" +
        temp_unit
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        document.getElementById("weather").innerText = `${
          json["current_weather"]["temperature"]
        } ${temp_unit == "celsius" ? "C" : "F"}`;
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
