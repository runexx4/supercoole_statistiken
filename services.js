var mysql = require("./mysql");

function services() {
    return new Promise(async(resolve, reject) => {

        (async () => {
            await mysql.connect();
            console.log("Connected!");

            let services = await mysql.getServices();
            console.log("services recieved!");

            await mysql.disconnect();
            console.log("Connection closed!");

            resolve(services);
        })();
        
    })
}

module.exports = services;
