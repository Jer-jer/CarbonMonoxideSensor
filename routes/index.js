const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sensordb',
    multipleStatements: true
});

function convertDate(d) {
    const date = new Date(d);
    const year = date.getFullYear();
    let m = date.getMonth() + 1;
  
    let day = date.getDate();
    day = parseInt(day) < 10 ? `0${day}` : day;
    return day + "/" + m + "/" + year;
}

router.get('/', (req, res, next) => {
    let sql = 'SELECT currentLevel, ppmVal, dateSensed, levels FROM current_state WHERE DATE_FORMAT(dateSensed, "%d") = DATE_FORMAT(NOW(), "%d");';
    sql += 'SELECT currentLevel, ppmVal, dateSensed, levels FROM current_state WHERE DATE_FORMAT(dateSensed, "%d") < DATE_FORMAT(NOW(), "%d") LIMIT 5;';
    sql += 'SELECT currentLevel FROM current_state WHERE DATE_FORMAT(dateSensed, "%d") = DATE_FORMAT(NOW(), "%d");';

    db.query(sql, [1, 2, 3], (err, data) => {
        if (err) throw err;
        res.render('index', {
            sensorData: data[0],
            pastData: data[1],
            levelCheck: data[2],
            convertDate: convertDate
        });
    });
});
module.exports = router;
exports.convertDate = convertDate();