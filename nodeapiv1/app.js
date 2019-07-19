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

const server = require("http").Server(app);
const io = require("socket.io")(server);
const portOfSocketIO = 8082;
const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED ,LOGOUT, COMMUNITY_CHAT } = require('./Event');
const { createUser, createMessage, createChat } = require('./Factories');

let connectedUsers = {};
let communityChat = createChat();

server.listen(portOfSocketIO, () => console.log(`Port of SocketIO is 
    listening on port ${portOfSocketIO}`));

// io.on('connection', function(socket) {
//     console.log("Co nguoi ket noi " + socket.id);

//     socket.on('client-send-Username', function(data) {
//         console.log(data);
//         if (mangUsers.indexOf(data) >= 0) {
//             socket.emit('server-send-dki-thatbai');
//         } else {
//             mangUsers.push(data);
//             socket.Username = data;
//             socket.emit('server-send-dki-thanhcong', data);
//             io.sockets.emit('server-send-danhsach-User', mangUsers);
//         }
//     });

//     // socket.emit('news', { hello: 'world' });
//     socket.on('disconnect', function (data) {
//         console.log(socket.id + "disconnect");
//     });
// });

io.on('connection', function(socket) {
    console.log("Co nguoi ket noi " + socket.id);

    //Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({ isUser: true, user: null})
        } else {
            callback({ isUser: false, user: createUser({name:nickname})})
        }
    })

    //User connects with username
    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        io.emit(USER_CONNECTED, connectedUsers)
        console.log(connectedUsers);
    })

    //User disconnects
    socket.on('disconnect', function (){
        if(!!socket.user){
          connectedUsers = removeUser(connectedUsers, socket.user)
          
          io.emit(USER_DISCONNECTED, connectedUsers)
        }
        console.log(connectedUsers, " ngat ket noi")
    })

    //Logout
    socket.on(LOGOUT, function(){
        connectedUsers = removeUser(connectedUsers, socket.user)
    })

    //Get Community Chat
    socket.on(COMMUNITY_CHAT, function(callback){
        callback(communityChat)
      })

});

function isUser(userList, username) {
    return username in userList;
}

function removeUser (userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList;
}

function addUser (userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
}



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
