function updateDataBase() {
    return new Promise(async(resolve, reject) => {
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
                if (!service.some(subArr => JSON.stringify(subArr) === JSON.stringify([element.service_name, element.service_code, element.category, element.type]))) {
                    service.push([element.service_name, element.service_code, element.category, element.type]);
                }
                if (!category.some(subArr => JSON.stringify(subArr) === JSON.stringify([element.category]))) {
                    category.push([element.category]);
                }
                if (!type.some(subArr => JSON.stringify(subArr) === JSON.stringify([element.type]))) {
                    type.push([element.type]);
                }
            });

            (async () => {
                await mysql.connect();
                console.log("Connected!");

                await mysql.update({
                    service: service,
                    category: category,
                    type: type
                });
                console.log("Update finished!");

                await mysql.disconnect();
                console.log("Connection closed!");
            })();

            resolve({
                service: service,
                category: category,
                type: type
            });

        }
        xhttp.open("GET", "https://www.klarschiff-sn.de/services.json");
        xhttp.send();
    })

}

module.exports = updateDataBase;