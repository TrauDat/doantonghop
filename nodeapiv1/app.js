const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//this code i'm building with socket.io :((
// const http = require('http')
// const socketIO = require('socket.io');
// const portSocketIO = 8888;
// const server = http.createServer(app);
// const io=socketIO(server);



// io.on('connection', function (socket) {
//     console.log("Co nguoi ket noi " + socket.id);

//     socket.on('change color', (color) => {
//         console.log('Color Changed to: ', color);
//         io.sockets.emit('change color', color);
//     });

//     socket.on('disconnect', () => {
//         console.log('user disconnected' + socket.id);
//     });
//     // socket.emit('news'. { hello: 'world'});
//     // socket.on('my other event', function (data) {
//     //     console.log(data);
//     // });
// });

// server.listen(portSocketIO, () => console.log(`Port of SocketIO is 
//     listening on port ${portSocketIO}`));

var server = require("http").Server(app);
var io = require("socket.io")(server);
var portOfSocketIO = 8888;
server.listen(portOfSocketIO);

io.on("connection", function(socket) {
    console.log("Co nguoi ket noi " + socket.id);

    socket.emit('news', { hello: 'world' });

});

server.listen(portOfSocketIO, () => console.log(`Port of SocketIO is 
    listening on port ${portSocketIO}`));

// db
// mongodb://kaloraat:dhungel8@ds257054.mlab.com:57054/nodeapi
// MONGO_URI=mongodb://localhost/nodeapi
mongoose
    .connect('mongodb+srv://dbnode:251090asd@cluster0-6okxm.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

// bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");


// middleware -
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/api", postRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: "Unauthorized!" });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});
