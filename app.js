const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = 3000;
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const router = require("./router.js");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: "Shh, its a secret!",
  // cookie: {
  //   maxAge: 30 * 60000
  // },
  resave: true,
  saveUninitialized: true
}));

app.use(router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = app;