const firebase = require("firebase/app");
require("firebase/auth");


var firebaseConfig = {
    apiKey: "AIzaSyC6tZpqmitjvI61_3X4J2DSS_-_w3J1XcU",
    authDomain: "node-zabhi.firebaseapp.com",
    databaseURL: "https://node-zabhi.firebaseio.com",
    projectId: "node-zabhi",
    storageBucket: "node-zabhi.appspot.com",
    messagingSenderId: "424219359183",
    appId: "1:424219359183:web:58d6a6aa0bec0679edc4ba",
    measurementId: "G-XC0Y4EHTVB"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.auth.Auth.Persistence.LOCAL;


exports.authenticate = (email, password) =>
  firebaseConfig.auth().signInWithEmailAndPassword(email, password);




