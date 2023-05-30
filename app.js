const express = require('express');
const app = express();
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

app.use(router);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

module.exports = app;