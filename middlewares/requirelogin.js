
const firebase = require('firebase/app');
require('firebase/auth');


module.exports = (req, res, next) => {
    firebase.auth().onAuthStateChanged(function(user) {
        console.log(user);
        if (!user) {
           
            return res.render('signin');
        } 
        });
    next();
};