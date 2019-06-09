
// use express module
var express = require('express')

//create an instance of express module
var app = express();
var http = require('http');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
const messageRoutes = require('./api/router/messageRoutes')
var mongoose = require('mongoose')


mongoose.connect('mongodb+srv://chatapp:<password>@cluster0-gkbun.mongodb.net/chatAppDB?retryWrites=true&w=majority', { useNewUrlParser: true }, (error) => {
    console.log('mongoDb connected', error)
})

io.on('connection', function(socket) {
    socket.on('new message', function(msg) {
        io.emit('new message', msg)
    })
})

// to tell express that we are using static files
app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, PATCH, POST, DELETE, GET');
        return res.status(200).json({});   
     }
next()
})

app.use(function(req, res, next) {
    req.io = io;
    next();
})

app.use('/chatApp', messageRoutes)
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
res.json({
    error: {
        message: error.message
    }
})
    console.log(error.message)
});

module.exports = app;

server.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("host and port are", host, " ", port)
})
