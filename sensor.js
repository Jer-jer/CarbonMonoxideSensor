var express = require("express");
var five = require("johnny-five");
var WebSocket = require("ws");
var favicon = require('serve-favicon');
var path = require('path');
var board = new five.Board();

var app = express();
var port = 3000;
var wss = new WebSocket.Server({port: 8080});


app.listen(port, () => {console.log("We are live")});
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use('/sensor', express.static(__dirname + '/public'));

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
    sensor.on("data", () => {
        console.log("Sensor: ");
        console.log("   Value   : ", sensor.value);
        console.log("Level: ", sensor.scaleTo(0, 10));
        console.log("-------------");
        if(sensor.scaleTo(0, 10) >= level){
            console.log("CO gas found");
            alarm.blink();
        }else{
            alarm.stop();
            alarm.off();
        }
        // if(sensor.value >= 820){
        //     console.log("CO gas found");
        //     alarm.blink();
        // }else{
        //     alarm.stop();
        //     alarm.off();
        // }
    });
});