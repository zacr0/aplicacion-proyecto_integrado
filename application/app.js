var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado'),
    //db = mongoose.connect('mongodb://localhost:27017/proyectointegrado'),
    admin_routes = require('./routes/admin_routes'); // Module for routing

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('t999YE72wJ'));
app.use(express.static(path.join(__dirname, 'public')));
// Duracion de la sesion = 2 horas
app.use(session({ secret: 'keyboard cat', cookie: {
    maxAge:  2 * 3600000
}}))

// Routing
admin_routes(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('No encontrado');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// socket.io
var users = [];
var rooms = [];

io.on('connection', function (socket) {
    // Introducimos al usuario en la sala por defecto
    socket.join('Pasillo');
    // Introduce la id del usuario en un array
    users.push(socket);
    var user = users.indexOf(socket);
    console.log('Usuario conectado: ' + socket.id);
    //console.log(users);

    // Informa al usuario que se ha conectado
    users[user].emit('info', 'Te has conectado al chat.');

    socket.on('message', function (nickname, message) {
        io.emit('message', nickname, message);
    });

    socket.on('connect_error', function (message) {
        users[user].emit('info', 'Error al conectar al chat.');
    });

    socket.on('reconnect', function (message) {
        users[user].emit('info', 'Te has reconectado al chat.');
    });

    socket.on('disconnect', function() {
        // Elimina al usuario del array al desconectarse
        console.log('Usuario desconectado: ' + socket.id);
        users.splice(user, 1);
   });
});

// set timezone
process.env.TZ = 'UTC+2';
server.listen(3000);
//app.listen(3000); // port to listen
console.log('Server running on localhost:3000');
console.log('Conectando a MongoDB...');

module.exports = app;