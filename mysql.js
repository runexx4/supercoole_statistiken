var mysql;
var connection;

function connect() {
    return new Promise((resolve, reject) => {
        mysql = require('mysql');
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'klarschiff_statistiken',
        });

        connection.connect(function (err) {
            if (err) throw err;

            resolve();
        });
    });
}

function update(resultObj) {
    return new Promise((resolve, reject) => {
        // update type
        var sql = "INSERT INTO type (type_name) VALUES ?";
        var values = resultObj.type;
        connection.query('DELETE FROM  type;', function (err, rows, fields) {
            if (err) throw err;
            console.log('All types deleted');
        });
        connection.query('ALTER TABLE type AUTO_INCREMENT = 1;', function (err, rows, fields) {
            if (err) throw err;
            console.log('Reset AUTO_INCREMENT of type');
        });
        connection.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log(`${result.affectedRows} types added`);

            var sql = "INSERT INTO category (category_name) VALUES ?";
            var values = resultObj.category;
            connection.query('DELETE FROM  category;', function (err, rows, fields) {
                if (err) throw err;
                console.log('All categorys deleted');

                connection.query('ALTER TABLE category AUTO_INCREMENT = 1;', function (err, rows, fields) {
                    if (err) throw err;
                    console.log('Reset AUTO_INCREMENT of category');

                    connection.query(sql, [values], function (err, result) {
                        if (err) throw err;
                        console.log(`${result.affectedRows} categorys added`);

                        // // update service
                        var sql = "INSERT INTO service (service_name, service_code, category_id, type_id) VALUES ?";
                        var values = resultObj.service;

                        connection.query("SELECT id, category_name FROM category", function (err, result) {
                            if (err) throw err;

                            let categoryObject = {};
                            result.forEach((element) => {
                                categoryObject[element.category_name] = element.id;
                            });

                            resultObj.service.forEach(category => {
                                category[2] = categoryObject[category[2]];
                            });

                            connection.query("SELECT id, type_name FROM type", function (err, result) {
                                if (err) throw err;

                                let typeObject = {};
                                result.forEach((element) => {
                                    typeObject[element.type_name] = element.id;
                                });

                                resultObj.service.forEach(category => {
                                    category[3] = typeObject[category[3]];
                                });

                                connection.query('DELETE FROM  service;', function (err, rows, fields) {
                                    if (err) throw err;
                                    console.log('All services deleted');

                                    connection.query('ALTER TABLE service AUTO_INCREMENT = 1;', function (err, rows, fields) {
                                        if (err) throw err;
                                        console.log('Reset AUTO_INCREMENT of service');

                                        connection.query(sql, [values], function (err, result) {
                                            if (err) throw err;
                                            console.log(`${result.affectedRows} services added`);

                                            resolve();
                                        });
                                    });

                                });
                            });

                        });
                    });
                });
            });
        });
    });
}

function disconnect() {
    return new Promise((resolve, reject) => {
        connection.end(function (err) {
            resolve();
        });
    });
}

function getServices() {
    return new Promise(async(resolve, reject) => {
        const serviceSQL = "SELECT service_code, service_name, category_id, type_id FROM service ";
        const categorySQL = "SELECT id, category_name FROM category ";
        const typeSQL = "SELECT id, type_name FROM Type ";

        let serviceObj = {}

        connection.query(serviceSQL, [], function (err, result) {
            serviceObj.service = result;

            connection.query(categorySQL, [], function (err, result) {
                serviceObj.category = result;

                connection.query(typeSQL, [], function (err, result) {
                    serviceObj.type = result;

                    resolve(serviceObj);
                })
            })
        })
        
        // var values = resultObj.type;

    })
}

module.exports = {
    connect,
    update,
    disconnect,
    getServices
};