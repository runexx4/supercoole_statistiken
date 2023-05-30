function updateDataBase(res) {
    var mysql = require("./mysql");
    var XMLHttpRequest = require('xhr2');

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        let response = JSON.parse(this.responseText);

        let service = [];
        let category = [];
        let type = [];

        // console.log(response);
        response.forEach(element => {
            if (!service.includes({
                    'service_code': element.service_code,
                    'service_name': element.service_name
                })) {
                service.push({
                    'service_code': element.service_code,
                    'service_name': element.service_name
                });
            }
            if (!category.includes(element.category)) {
                category.push(element.category);
            }
            if (!type.some(subArr => JSON.stringify(subArr) === JSON.stringify([element.type]))) {
                type.push([element.type]);
            }
        });

        mysql.connect();

        mysql.update({service: service, category: category, type: type});

        mysql.disconnect();


        //   res.send(JSON.parse(this.responseText).service);
    }
    xhttp.open("GET", "https://www.klarschiff-sn.de/services.json");
    xhttp.send();
}

module.exports = updateDataBase;