const pullKey = "<YOUR_RTIRL_PULL_KEY>";
const mapboxToken = "<YOUR_MAPBOX_AT>";

const format =
  "${data.neighborhood ? data.neighborhood.text + ', ' : ''}${data.place?.text}";

var i = 0;
var app;

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

  var mapboxClient = mapboxSdk({
    accessToken: mapboxToken,
  });

  addLocationListener(function (location) {
    if (i++ % 50 == 0) {
      mapboxClient.geocoding
        .reverseGeocode({
          query: [location.longitude, location.latitude],
          language: ["en"],
        })
        .send()
        .then((response) => {
          var context = {};
          for (var param of [
            "country",
            "region",
            "postcode",
            "district",
            "place",
            "locality",
            "neighborhood",
            "address",
            "poi",
          ]) {
            context[param] = response.body.features.find((feature) =>
              feature.place_type.includes(param)
            );
          }
          var result = wrappedEval("`" + format + "`", context);
          if (!result.includes("undefined")) {
            document.getElementById("text").innerText = result;
          }
        });
    }
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

function wrappedEval(textExpression, contextData) {
  let fn = Function(`"use strict"; var data = this;return (${textExpression})`);
  return fn.bind(contextData)();
}
