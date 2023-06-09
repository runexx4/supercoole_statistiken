function requests() {
    return new Promise(async (resolve, reject) => {
        const XMLHttpRequest = require('xhr2');
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            let response = JSON.parse(this.responseText);
            let requests = [];
            for (var i = 0; i < response.length; ++i) {

                requests.push({
                    requestId: response[i].service_request_id,
                    serviceCode: response[i].service_code,
                    serviceName: response[i].service_name,
                    requestedDatetime: response[i].requested_datetime,
                    updatedDatetime: response[i].updated_datetime,
                    expectedDatetime: response[i].expected_datetime
                });

            }
            resolve(requests);
        }
        xhttp.open("GET", "https://www.klarschiff-sn.de/requests.json");
        xhttp.send();
    })
}

module.exports = requests;