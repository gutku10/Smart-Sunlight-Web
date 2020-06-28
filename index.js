const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
require('firebase/auth');
var flash = require('connect-flash');
app = express();
const requireLogin = require('./middlewares/requirelogin');

require('firebase/database');

app.use(
  require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'This is ryzit',
  })
);
app.use(express.static('public'));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var firebaseConfig = {
  apiKey: 'AIzaSyC6tZpqmitjvI61_3X4J2DSS_-_w3J1XcU',
  authDomain: 'node-zabhi.firebaseapp.com',
  databaseURL: 'https://node-zabhi.firebaseio.com',
  projectId: 'node-zabhi',
  storageBucket: 'node-zabhi.appspot.com',
  messagingSenderId: '424219359183',
  appId: '1:424219359183:web:58d6a6aa0bec0679edc4ba',
  measurementId: 'G-XC0Y4EHTVB',
};

firebase.initializeApp(firebaseConfig);
firebase.auth.Auth.Persistence.LOCAL;

app.get('/',(req, res) => {
    if(!req.user){
        res.render('signin');
    }
    else{
        res.render('index');
    }
  
});

app.post('/signin', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  if (email != '' && password != '') {
    var result = firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        res.render('index');
      });

    result.catch(function (error) {
      req.flash('error', errorMessage);
      res.redirect('/');
    });
  } else {
    req.flash('error', 'Please fill details');
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  firebase.auth().signOut();
  res.render('signin');
});

app.get('/resetPassword', (req, res) => {
    res.render('forgetPassword');
  });
  

app.post('/resetPassword', (req, res) => {
  var email = req.body.email;

    firebase.auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        window.alert('Email has been sent to you, Please check your email');
      })
      .catch(function (error) {
        req.flash('error', errorMessage);
        res.redirect('/');
      })
    });



app.get('/addRoom', (req, res) => {
    res.render('accountSetting');
  });

app.post('/addRoom', (req, res) => {
    var block = req.body.block;
    var room_no = req.body.room_no;
    // var curtains = req.body.curtains;
    // var led = req.body.led;
    

    var rootRef1 = firebase.database().ref().child('Rooms');
    var rootRef2 = rootRef1.child(block);
    var rootRef = rootRef2.child(room_no);
    var cur = rootRef.child('Curtains');
    var led = rootRef.child('LEDs');
    var room_sensor = rootRef.child('Room Sensor');
    var win = rootRef.child('Window Sensor');
      var userData ={
          'Automatic Status': true,
          Class: room_no,
          ClassLux: 400,
          Status: true,
      }
  
      var userData1 ={
       
       
    }

    var userData2 ={
      'Automatic Status': true,
      Class: room_no,
      ClassLux: 400,
      Status: true,
  }

  var userData3 ={
    'Automatic Status': true,
    Class: room_no,
    ClassLux: 400,
    Status: true,
}
      

    rootRef.set(userData);
    cur.set(userData1);
    led.set(userData2);
    room_sensor.set(userData3);

          // rootRef.set((userData),function(error){
      //     if(error){
      //     req.flash('error', errorMessage);
      //     res.redirect('signin');
      // }else {
      // res.render("index");
      // }
      // }
      // )
    //  root.set(userData).child('Curtains');
    // //   var userData1 ={
    // //     'Automatic Status': true,
    // //     Class: room_no,
    // //     ClassLux: 400,
    // // }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));