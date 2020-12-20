const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sensordb'
});

router.get('/', (req, res, next) => {
    let sql = "SELECT dateSensed, ppmVal, levels, currentLevel FROM current_state WHERE DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(NOW(), '%d') UNION ALL SELECT id, dateeSensed, lastPPM, levelss FROM overall_states;";

    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.render('index', {sensorData: data});
    });
});
module.exports = router;