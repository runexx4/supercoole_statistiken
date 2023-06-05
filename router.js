var express = require('express');
const path = require('path')
var router = express.Router();

var updateDataBase = require("./update_database.js");
var auth = require("./authentication.js");

// define the home page route
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
    if(!req.session.authorized){
        res.cookie('auth', false);
    }
});

router.get('/update-database', function (req, res) {
    console.log(req.session)
    if (req.session.authorized) {
        (async () => {
            const result = await updateDataBase();
            res.send(result);
        })();
    } else {
        res.send("not authorised!");
    }
});

router.post('/auth', function (req, res) {
    const password = req.body.password;
    const signOut = req.body.signOut;
    if(signOut === "true"){
        req.session.authorized = false;
        res.cookie('auth', false); //Sets testAuth = result
        res.send("Signed Out!");
    }else{
        (async () => {
            const result = await auth(password);
    
            req.session.authorized = result;
            res.cookie('auth', result); //Sets testAuth = result
    
            res.send(result);
        })();
    }
});

//public files
router.use('/public', express.static(path.join(__dirname, 'public')));

module.exports = router;