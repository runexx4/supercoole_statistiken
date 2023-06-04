const fs = require('fs');
const bcrypt = require('bcrypt');
const pwPath = './adminPw.json';

function auth(password) {
    return new Promise((resolve, reject) => {
        fs.readFile(pwPath, 'utf8', (err, data) => {
            if (err) {
              console.error('Fehler beim Lesen der Datei:', err);
              reject(err);
              return;
            }
            const adminPw = JSON.parse(data).adminPw;

            bcrypt.compare(password, adminPw, function(err, result) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    })
}

module.exports = auth;
