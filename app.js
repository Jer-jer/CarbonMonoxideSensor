const express = require('express');
const five = require('johnny-five');
const WebSocket = require("ws");
const favicon = require('serve-favicon');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

var board = new five.Board();
var app = express();
var port = 3000;
var wss = new WebSocket.Server({port: 8080});

//Create DB
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sensordb'
});

//Create Route and Open Server
app.use(bodyParser.urlencoded({extended: false}));
app.listen(port, () => {console.log("Server Live on port 3000")});
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use('/sensor', express.static(__dirname + '/public'));

app.post('/sensor', function(req, res) {
    console.log(req.body);
});

//Connect DB
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("Database Successfully Connected");
});

//Arduino Read Data and Pass to Database
board.on('ready', function(){
    const sensor = new five.Sensor({
        pin: "A0",
        freq: 2000
    });
    var alarm = new five.Led(13);
    var on = new five.Led(9);
    var level = 8;

    wss.on('connection', function(ws, req){
        console.log('Connected');
        ws.on('message', function(data){
            level = data;
        })
    })

    on.on();
    // sensor.on("data", () => {
    //     console.log("Sensor: ");
    //     console.log("   Value   : ", sensor.value);
    //     console.log("Level: ", sensor.scaleTo(0, 10));
    //     console.log("-------------");
    //     if(sensor.scaleTo(0, 10) >= level){
    //         console.log("CO gas found");
    //         alarm.blink();
    //     }else{
    //         alarm.stop();
    //         alarm.off();
    //     }
    // });
});