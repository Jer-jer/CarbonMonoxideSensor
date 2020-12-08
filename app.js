const express = require('express');
const five = require('johnny-five');
const WebSocket = require("ws");
const favicon = require('serve-favicon');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { isBuffer } = require('util');

var board = new five.Board();
var app = express();
var port = 8080;
// var wss = new WebSocket.Server({port: 8080});
var level = 8;

//Create DB
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sensordb'
});

//Create Route and Open Server
app.use(bodyParser.urlencoded({extended: true}));
app.listen(port, () => {console.log("Server Live on port 3000")});
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use('/', express.static(__dirname + '/public'));

//Connect DB
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("Database Successfully Connected");
});


//UPDATE LEVEL
app.post('/', function(req, res) {
    console.log(req.body);
    // let sql = "INSERT INTO current_state (levels) VALUES ("+ req.body.level +");";
    let sql = "UPDATE current_state SET levels = "+ req.body.level +" WHERE DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(NOW(), '%d');";
    db.query(sql, (err) => {
        if(err) throw err;
    });
    level = req.body.level;
    res.redirect("/");
});

//Arduino Read Data and Pass to Database
board.on('ready', function(){
    const sensor = new five.Sensor({
        pin: "A0",
        freq: 2000
    });
    var alarm = new five.Led(13);
    var on = new five.Led(9);

    // wss.on('connection', function(ws, req){
    //     console.log('Connected');
    //     ws.on('message', function(data){
    //         level = data;
    //     })
    // })

    on.on();
    sensor.on("data", () => {
        console.log("Sensor: ");
        console.log("   Value   : ", sensor.value);
        console.log("Level: ", sensor.scaleTo(0, 10));
        console.log("-------------");

        //UPDATE SENSOR VALUE IN DATABASE
        // let sensorVAL = "UPDATE current_state SET ppmVal = "+ sensor.value +" WHERE idNum = 1;";
        let sensorVAL = "UPDATE current_state SET ppmVal = "+ sensor.value +" WHERE DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(NOW(), '%d');";
        db.query(sensorVAL, (err) => {
            if(err) throw err;
        });
        if(sensor.scaleTo(0, 10) >= level){
            console.log("CO gas found");
            alarm.blink();
        }else{
            alarm.stop();
            alarm.off();
        }
    });
});