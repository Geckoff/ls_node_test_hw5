const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/index");
const initIo = require("./websocket");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const cors = require("cors");
require("./db");

var app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/", router);

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "client/build/index.html"));
});

const port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log("Go to http://localhost:" + server.address().port);
});

initIo(io);
