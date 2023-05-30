var express = require('express');
const path = require('path')
var router = express.Router();

// var updateDataBase = require("./update_database.js");

// define the home page route
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

// router.get('/update-database', function (req, res) {
//     // res.sendFile(path.join(__dirname, 'public/pages/index.html'));
//     updateDataBase(res);

//     res.sendStatus(200);
// });

//public files
router.use('/public', express.static(path.join(__dirname, 'public')));

module.exports = router;