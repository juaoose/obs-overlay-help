const pullKey = "<YOUR_RTIRL_PULL_KEY>";

var app;
var timer;

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

  addSpeedListener(function (speed) {
    clearTimeout(timer); //don't reset to 0 if moving

    const speedInKmh = (speed * 3.6) | 0;
    document.getElementById("speed").innerText =
      speedInKmh > 0 ? speedInKmh : 0;

    timer = setTimeout(() => {
      //reset to 0 if not moving for 30 sec
      document.getElementById("speed").innerText = 0;
    }, 30000);
  });
}

function addSpeedListener(callback) {
  return addListener("speed", callback);
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
