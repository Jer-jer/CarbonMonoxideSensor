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
    let sql = "SELECT * FROM current_state WHERE DATE_FORMAT(dateSensed, '%d') = DATE_FORMAT(NOW(), '%d');";
    sql += " SELECT TOP 5 * FROM current_state WHERE DATE_FORMAT(dateSensed, '%d') < DATE_FORMAT(NOW(), '%d');";

    db.query(sql, [1, 2], (err, data) => {
        if (err) throw err;
        res.render('index', {
            sensorData: data[0],
            pastData: data[1]
        });
    });
});
module.exports = router;