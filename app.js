const express = require('express');
const five = require('johnny-five');
const favicon = require('serve-favicon');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();

//ROUTERS
const indexRouter = require('./routes/index');

var board = new five.Board();
var app = express();
var port = process.env.PORT || 3000;
// var wss = new WebSocket.Server({port: 8080});

var level = 8;

//CONNECT DB
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sensordb',
    multipleStatements: true
});

//Create Route and Open Server
app.use(bodyParser.urlencoded({extended: true}));
app.listen(port, () => {console.log("Server Live on port 3000")});
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Set Views
app.set('views','./views');
app.set('view engine', 'ejs');

//STATIC ROUTES
app.use(express.static('/public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/routes', express.static(__dirname + '/routes'));


//PAGES
app.use('/', indexRouter);


//Connect DB
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("Database Successfully Connected");
});

//INSERT DATA DAILY
let insert = "INSERT IGNORE INTO current_state (levels, dateSensed) VALUES (8, NOW());";
db.query(insert, (err) => {
    if(err) throw err;
});

//SET LEVEL
// let ppmLevel = "SELECT levels FROM current_state WHERE DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(NOW(), '%d');";
// db.query(ppmLevel, (err, data) => {
//     if(err) throw err;
//     level = data;
// });

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
        let sensorVAL = "UPDATE current_state SET ppmVal = "+ sensor.value +", currentLevel = "+ sensor.scaleTo(0, 10) +" WHERE DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(NOW(), '%d');";
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