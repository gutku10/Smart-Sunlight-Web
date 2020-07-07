const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
require('firebase/auth');
var flash = require('connect-flash');
app = express();
const requireLogin = require('./middlewares/requirelogin');
// const { app } = require('firebase/app');


require('firebase/database');

app.use(
  require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'This is streetlight',
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
  // apiKey: 'AIzaSyC6tZpqmitjvI61_3X4J2DSS_-_w3J1XcU',
  // authDomain: 'node-zabhi.firebaseapp.com',
  // databaseURL: 'https://node-zabhi.firebaseio.com',
  // projectId: 'node-zabhi',
  // storageBucket: 'node-zabhi.appspot.com',
  // messagingSenderId: '424219359183',
  // appId: '1:424219359183:web:58d6a6aa0bec0679edc4ba',
  // measurementId: 'G-XC0Y4EHTVB',

  apiKey: "AIzaSyCUwlWgDhnqo_iGNCKG309wI0VyV2eMlFk",
  authDomain: "smart-sunlight.firebaseapp.com",
  databaseURL: "https://smart-sunlight.firebaseio.com",
  projectId: "smart-sunlight",
  storageBucket: "smart-sunlight.appspot.com",
  messagingSenderId: "281416114832",
  appId: "1:281416114832:web:06ff97ef01208c1889ee15"
};

firebase.initializeApp(firebaseConfig);
firebase.auth.Auth.Persistence.LOCAL;

app.get('/', (req, res) => {
    res.render('dashboard');

});

app.get('/signin', (req,res) => {
  res.render('signin');
})

app.post('/signin', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  if (email != '' && password != '') {
    var result = firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
            res.redirect('/');
        });
      
      

    result.catch(function (error) {
      // req.flash('error', errorMessage);
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

  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      window.alert('Email has been sent to you, Please check your email');
    })
    .catch(function (error) {
      req.flash('error', errorMessage);
      res.redirect('/');
    });
});

app.get('/staff', (req, res) => {
  var admin = firebase.database().ref("Admin")
  admin.once("value", data => {
    if(data.val()){
      var names = Object.getOwnPropertyNames(data.val())
      res.render('staff',{ adminNames : names ,data : data.val() });
    }else{
      res.send("i m here")
    }
  } )
});

app.post('/staff', (req, res) => {
  
  var email = req.body.email;
  var password = req.body.Password;
  var fname = req.body.fname;
  var sname = req.body.sname;
  var dept = req.body.dept;
  var auth = req.body.auth;
  firebase.auth().createUserWithEmailAndPassword(email, password);
  var root = firebase.database().ref().child(auth);
  var root2 = root.child(fname + ' ' + sname);
  var userData = {
    Email: email,
    Password: password,
    Department: dept,
  };

  root2.set(userData);
  res.redirect('/staff');
  console.log('abhi');
});

app.get('/addRoom', (req, res) => {
  res.render('addRoom');
});

app.post('/addRoom', (req, res) => {
  var block = req.body.block;
  var room_no = req.body.room_no;
  var class_lux = req.body.class_lux;
  const numberOfWindows = req.body.curtains;
  var status = req.body.status;
  const numberofLeds = req.body.leds;
  const numberofroom_sensor = req.body.room_sensor;
  const numberofwindow_sensor = req.body.window_sensor;

  var rootRef1 = firebase.database().ref().child('Rooms');
  var rootRef2 = rootRef1.child(block);
  var rootRef = rootRef2.child(room_no);
  var cur = rootRef.child('Curtains');
  var led = rootRef.child('LEDs');
  var room_sensor = rootRef.child('Room Sensor');
  var window_sensor = rootRef.child('Window Sensor');
  var show = rootRef.child('Show in App');
  var userData = {
    Class: room_no,
    Block: block,
    'Class Lux': 50,
    Status: true,
  };

  var userData1 = {};
  function Windows(numberOfWindows) {
    var i = 1;
    while (i <= numberOfWindows) {
      var windows = 'Curtain ' + i;
      userData1[windows] = {
        'Automatic Status' : true,
        Value : 100
      }
      i = i + 1;
    }
  }

  var userData2 = {};
  function Led(numberofLeds) {
    var i = 1;
    while (i <= numberofLeds) {
      var LED = 'LED ' + i;
      userData2[LED] =  {
        'Automatic Status' : true,
        Value : 100
      }
      i = i + 1;
    }
  }

  var userData3 = {};
  function Room(numberOfroom_sensor) {
    var i = 1;
    while (i <= numberOfroom_sensor) {
      var windows = 'Room ' + i;
      userData3[windows] = 100;
      i = i + 1;
    }
  }

  var userData4 = {};
  function Window_sen(numberOfwindow_sensor) {
    var i = 1;
    while (i <= numberOfwindow_sensor) {
      var windows = 'Window ' + i;
      userData4[windows] = 100;
      i = i + 1;
    }
  }

  var userData9 = {
    'LEDs' : true,
    'Curtains': true
  }

  Windows(numberOfWindows);
  Led(numberofLeds);
  Room(numberofroom_sensor);
  Window_sen(numberofwindow_sensor);

  rootRef.set(userData);
  cur.set(userData1);
  led.set(userData2);
  room_sensor.set(userData3);
  window_sensor.set(userData4);
  show.set(userData9);

  res.redirect('/manage');
});

app.get('/manage',  (req, res) => {
  var data;
  var rooms = firebase.database().ref('Rooms');
  rooms.once('value', (data) => {
    if (data.val()) {
      var accessedData = data.val();
      var blocks = Object.getOwnPropertyNames(accessedData);
      var rooms = [];
      blocks.forEach((blockName) => {
        rooms.push({
          blockName: blockName,
          roomNames: Object.getOwnPropertyNames(accessedData[blockName]),
        });
      });
      var roomData = accessedData[rooms[0].blockName][rooms[0].roomNames[0]];
      var leds = Object.getOwnPropertyNames(roomData.LEDs);
      var windowSensor = Object.getOwnPropertyNames(roomData['Window Sensor']);
      var roomSensor = Object.getOwnPropertyNames(roomData['Room Sensor']);
      var curtains = Object.getOwnPropertyNames(roomData['Curtains']);
      res.render('manage', {
        blocks,
        roomData,
        rooms,
        leds,
        windowSensor,
        roomSensor,
        curtains,
      });
    } else {
      console.log('i m in else');
      res.send('error');
    }
  });
});


app.get('/managed-:block-:room',  (req, res) => {
  var data;
  var rooms = firebase.database().ref('Rooms');
  rooms.once('value', (data) => {
    if (data.val()) {
      var accessedData = data.val();
      var blocks = Object.getOwnPropertyNames(accessedData);
      var rooms = [];
      var roomData;
      blocks.forEach((blockName) => {
        if(blockName == req.params.block){
          rooms.push( 
            {
              blockName: blockName,
              roomNames: Object.getOwnPropertyNames(accessedData[blockName]),
            } );
            if(Object.getOwnPropertyNames(accessedData[blockName]) == req.params.room ){
              console.log("here for " + req.params.room)
              roomData = accessedData[blockName][req.params.room]
            }
        }
      });
      var leds = Object.getOwnPropertyNames(roomData.LEDs);
      var windowSensor = Object.getOwnPropertyNames(roomData['Window Sensor']);
      var roomSensor = Object.getOwnPropertyNames(roomData['Room Sensor']);
      var curtains = Object.getOwnPropertyNames(roomData['Curtains']);
      res.render('manage', {
        blocks,
        roomData,
        rooms,
        leds,
        windowSensor,
        roomSensor,
        curtains,
      });
    } else {
      console.log('i m in else');
      res.send('error');
    }
  });
});

app.get('/manage-:block',  (req, res) => {
  var data;
  var rooms = firebase.database().ref('Rooms');
  rooms.once('value', (data) => {
    if (data.val()) {
      var accessedData = data.val();
      var blocks = Object.getOwnPropertyNames(accessedData);
      var rooms = [];
      blocks.forEach((blockName) => {
        if(blockName == req.params.block){
          rooms.push({
            blockName: blockName,
            roomNames: Object.getOwnPropertyNames(accessedData[blockName]),
          });
        }
      });
      var roomData = accessedData[req.params.block][rooms[0].roomNames[0]];
      var leds = Object.getOwnPropertyNames(roomData.LEDs);
      var windowSensor = Object.getOwnPropertyNames(roomData['Window Sensor']);
      var roomSensor = Object.getOwnPropertyNames(roomData['Room Sensor']);
      var curtains = Object.getOwnPropertyNames(roomData['Curtains']);
      res.render('manage', {
        blocks,
        roomData,
        rooms,
        leds,
        windowSensor,
        roomSensor,
        curtains,
      });
    } else {
      console.log('i m in else');
      res.send('error');
    }
  });
});

app.post('/manage',  (req, res) => {
  var rooms = firebase.database().ref('Rooms');
  rooms.once('value', (data) => {
    if (data.val()) {
      var accessedData = data.val();
      var blocks = Object.getOwnPropertyNames(accessedData);
      var requiredBlock = accessedData[req.body.block];
      var roomData = requiredBlock[req.body.room];
      var rooms = [];
      blocks.forEach((blockName) => {
        rooms.push({
          blockName: blockName,
          roomNames: Object.getOwnPropertyNames(accessedData[blockName]),
        });
      });
      var leds = Object.getOwnPropertyNames(roomData.LEDs);
      var windowSensor = Object.getOwnPropertyNames(roomData['Window Sensor']);
      var roomSensor = Object.getOwnPropertyNames(roomData['Room Sensor']);
      var curtains = Object.getOwnPropertyNames(roomData['Curtains']);
      res.render('manage', {
        blocks,
        roomData,
        rooms,
        leds,
        windowSensor,
        roomSensor,
        curtains,
      });
    } else {
      console.log('i m in else');
      res.send('error');
    }
  });
});

app.post('/updateRoomSensor',  (req, res) => {
  var requiredRoom = firebase
    .database()
    .ref('Rooms/' + req.body.block + '/' + req.body.room);
  requiredRoom.once('value', (data) => {
    if (data.val()) {
      var Data = data.val();
      var requiredElement = Data[req.body.update];
      if(req.body.isUpdate){
        requiredElement[req.body.element] = req.body.status;
      }
      if(req.body.isDelete){
        delete requiredElement[req.body.element]
      }
      if(req.body.isAdd){
        var names  = Object.getOwnPropertyNames(requiredElement)
        var last = names[names.length-1]
        var number = Number(last.slice(last.length-1,last.length))
        var newName = 'Room ' + (number+1)
        requiredElement[newName] = 100
      }
      requiredRoom
        .update({
          'Room Sensor': requiredElement,
        })
        .then(() => {
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', err.message);
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        });
    } else {
      req.flash('error', 'Unexpected Error Occured');
      res.redirect('/managed-' + req.body.block + "-" + req.body.room );
    }
  });
});

app.post('/updateCurtains',  (req, res) => {
  var requiredRoom = firebase
    .database()
    .ref('Rooms/' + req.body.block + '/' + req.body.room);
  requiredRoom.once('value', (data) => {
    if (data.val()) {
      var Data = data.val();
      var requiredElement = Data[req.body.update]; 
      if(req.body.isUpdateStatus){
        requiredElement[req.body.element]['Automatic Status'] = (req.body.status =="true");
      }
      if(req.body.isUpdate){
        requiredElement[req.body.element]['Value'] = parseInt(req.body.status);
      }
      if(req.body.isDelete){
        delete requiredElement[req.body.element]
      }
      if(req.body.isAdd){
        var names  = Object.getOwnPropertyNames(requiredElement)
        var last = names[names.length-1]
        var number = Number(last.slice(last.length-1,last.length))
        var newName = 'Curtain ' + (number+1)
        requiredElement[newName] = {
          'Automatic Status' : true,
          'Value' : 100
        }
      }
      requiredRoom
        .update({
          Curtains: requiredElement,
        })
        .then(() => {
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', err.message);
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        });
    } else {
      req.flash('error', 'Unexpected Error Occured');
      res.redirect('/managed-' + req.body.block + "-" + req.body.room );
    }
  });
});

app.post('/updateLEDs', (req, res) => {
  var requiredRoom = firebase
    .database()
    .ref('Rooms/' + req.body.block + '/' + req.body.room);
  requiredRoom.once('value', (data) => {
    if (data.val()) {
      var Data = data.val();
      var requiredElement = Data[req.body.update];
      if(req.body.isUpdate){
        requiredElement[req.body.element]['Value'] = parseInt(req.body.status);
      }
      if(req.body.isUpdateStatus){
        requiredElement[req.body.element]['Automatic Status'] = (req.body.status =="true");
      }
      if(req.body.isDelete){
        delete requiredElement[req.body.element]
      }
      if(req.body.isAdd){
        var names  = Object.getOwnPropertyNames(requiredElement)
        var last = names[names.length-1]
        var number = Number(last.slice(last.length-1,last.length))
        var newName = 'LED ' + (number+1)
        requiredElement[newName] = {
          'Automatic Status' : true,
          'Value' : 100
        }
      }
      requiredRoom
        .update({
          LEDs: requiredElement,
        })
        .then(() => {
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', err.message);
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        });
    } else {
      req.flash('error', 'Unexpected Error Occured');
      res.redirect('/managed-' + req.body.block + "-" + req.body.room );
    }
  });
});

app.post('/updateWindowSensor',  (req, res) => {
  var requiredRoom = firebase
    .database()
    .ref('Rooms/' + req.body.block + '/' + req.body.room);
  requiredRoom.once('value', (data) => {
    if (data.val()) {
      var Data = data.val();
      var requiredElement = Data[req.body.update];
      if(req.body.isUpdate){
        requiredElement[req.body.element] = req.body.status;
      }
      if(req.body.isDelete){
        delete requiredElement[req.body.element]
      }
      if(req.body.isAdd){
        var names  = Object.getOwnPropertyNames(requiredElement)
        var last = names[names.length-1]
        var number = Number(last.slice(last.length-1,last.length))
        var newName = 'Window ' + (number+1)
        requiredElement[newName] = 100
      }
      requiredRoom
        .update({
          'Window Sensor': requiredElement,
        })
        .then(() => {
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', err.message);
          res.redirect('/managed-' + req.body.block + "-" + req.body.room );
        });
    } else {
      req.flash('error', 'Unexpected Error Occured');
      res.redirect('/managed-' + req.body.block + "-" + req.body.room );
    }
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started at port ${port}`));
