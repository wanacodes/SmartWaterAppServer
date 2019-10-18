const express = require('express');
const morgan = require('morgan');

// Initialize express library
const app = express();

// Initialize firebase database library
var admin = require("firebase-admin");

var serviceAccount = require("./server/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-water-system-983ac.firebaseio.com"
});

const ref = admin.database().ref('water_level');

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded that arduino used
app.use(express.json()); // for parsing json


// Route handle Post request from the Arduino
app.post('/water/level', (req, res) => {
    console.log(req.body.moistureLevel);
    // console.log(ref)
    var today = new Date();
    // ensure date comes as 01, 09 etc
    var DD = ("0" + today.getDate()).slice(-2);

    // getMonth returns month from 0
    var MM = ("0" + (today.getMonth() + 1)).slice(-2);

    var YYYY = today.getFullYear();

    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    
    m = checkTime(m);
    s = checkTime(s);

    req.body.time = today.toLocaleTimeString();
    req.body.date = DD + "-" + MM + "-" + YYYY;

    ref.once('value')
        .then(snapshot => {
            ref.push(req.body)
        });
    console.log('_t1'+ h + m + '##_d180##_d2' + req.body.moistureLevel + '##');
    res.send('_t1'+ h + m + '##_d180##_d2' + req.body.moistureLevel + '##');

})

// Route received handle Get request from the mobile or web
app.get('/water/status', (req, res) => {

    ref.orderByKey().limitToLast(1).once('value')
    .then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const data = {
                level: childSnapshot.val().moistureLevel,
                date: childSnapshot.val().date,
                time: childSnapshot.val().time
            }
            console.log(data);
            res.send(data);

        });
        // console.log(obj);
        
        
    }, function(err){
        console.log("Error: " + err)
    });
});

app.listen(3000, () => {console.log("Listen to port 3000...")});

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

  