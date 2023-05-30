var mysql;
var connection;

function connect() {
    mysql = require('mysql');
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
    });

    connection.connect();
}

function update(resultObj) {

    // update type
    var sql = "INSERT INTO klarschiff_statistiken.type (type_name) VALUES ?";
    var values = resultObj.type;
    connection.query('DELETE FROM  klarschiff_statistiken.type;', function (err, rows, fields) {
        if (err) throw err;
        console.log('All Types deleted');
    });
    connection.query('ALTER TABLE klarschiff_statistiken.type AUTO_INCREMENT = 1;', function (err, rows, fields) {
        if (err) throw err;
        console.log('Reset AUTO_INCREMENT of Type');
    });
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(`${result.affectedRows} Types added`);
    });

    // connection.query('SELECT * FROM klarschiff_statistiken.type;', function (err, rows, fields) {
    //     if (err) throw err;
    //     console.log('The solution is: ', rows);
    // });

    // // update category
    // var sql = "INSERT INTO klarschiff_statistiken.category (category_name, type_id) VALUES ?";
    // var values = resultObj.type;
    // connection.query('DELETE FROM  klarschiff_statistiken.type;', function (err, rows, fields) {
    //     if (err) throw err;
    //     console.log('The solution is: ', rows);
    // });
    // connection.query(sql, [values], function (err, result) {
    //     if (err) throw err;
    //     console.log("Number of records inserted: " + result.affectedRows);
    // });

    // // update service
    // var sql = "INSERT INTO klarschiff_statistiken.type (type_name) VALUES ?";
    // var values = resultObj.type;
    // connection.query('DELETE FROM  klarschiff_statistiken.type;', function (err, rows, fields) {
    //     if (err) throw err;
    //     console.log('The solution is: ', rows);
    // });
    // connection.query(sql, [values], function (err, result) {
    //     if (err) throw err;
    //     console.log("Number of records inserted: " + result.affectedRows);
    // });
}

function disconnect() {
    connection.end();
}

module.exports = {
    connect,
    update,
    disconnect
};