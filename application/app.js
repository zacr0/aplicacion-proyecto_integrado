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
    Promocion = require('./models/Promocion'),
    //Asignatura = require('./models/Asignatura'),
    async = require('async'),
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

// socket.io (seria apropiado exportar a otro fichero)
var users = [];
var rooms = ['Pasillo',
    'Sala de profesores',
    'La Chaty'];

// Obtencion e insercion de salas de promociones
var query = Promocion.find({}, {_id: 0});   

query.exec(function (err, promociones) {
    if (err) {
        return console.log(err);
    } else {
        if (promociones.length > 0) {
            for (var i = promociones.length - 1; i >= 0; i--) {
                rooms.push(promociones[i].nombre);
            };
        } else {
            console.log("No hay promociones");
        }
    }
});
// Obtencion e insercion de salas de asignaturas
// COMENTADO PORQUE CREA UN ARRAY DEMASIADO GRANDE PARA EL NAVEGADOR
/*var query = Asignatura.find({}, {_id: 0, "id_curso": 0}).sort({"nombre": 1});

query.exec(function (err, asignaturas) {
    if (err) {
        return console.log(err);
    } else {
        if (asignaturas.length > 0) {
            for (var i = asignaturas.length - 1; i >= 0; i--) {
                rooms.push(asignaturas[i].nombre);
            };
            console.log(rooms);
        } else {
            console.log("No hay asignaturas");
        }
    }
});*/

io.on('connection', function (socket) {
    // Introducimos al usuario en la sala por defecto
    socket.room = rooms[0];

    // Introduce la id del usuario en el array de usuarios
    users.push(socket);
    var user = users.indexOf(socket);
    console.log('Usuario: ' + socket.id + ' conectado a '
        + 'la sala ' +  socket.room);

    // Conexion del usuario a la sala por defecto
    socket.join(socket.room, function (err) {
        if (err) {
            users[user].emit('error', 'Error al conectar a la sala.');
        } else {
            users[user].emit('currentroom', socket.room);
        }
    });

    // Informa al usuario que se ha conectado
    users[user].emit('info', 'Conectado al chat.');

    // Envia las salas existentes al cliente
    users[user].emit('rooms', rooms);

    // Envio de mensajes a la sala del usuario
    socket.on('message', function (message) {
        io.in(socket.room).emit('message', socket.nickname, message);
    });

    // Nombre de usuario
    socket.on('nickname', function(nickname) {
        socket.nickname = nickname;
        // Informa a la sala de la conexion
        socket.broadcast.to(socket.room).emit('info', socket.nickname + ' se ha conectado.');
        console.log('Nombre de usuario: ' + socket.nickname);
    });

    // Cambio de sala
    socket.on('switchroom', function (room) {
        var user = users.indexOf(socket);
        // Desconecta al usuario de la sala actual
        socket.leave(socket.room);
        io.in(socket.room).emit('info', socket.nickname + ' ha cambiado de sala.');
        // Conecta al usuario a la nueva sala
        socket.room = room;
        socket.join(room, function (err) {
            if (err) {
                users[user].emit('error', 'Error al conectar a la sala.');
            } else {
                console.log('Usuario: ' + socket.nickname + ' cambia a la sala '
                     + room);
                users[user].emit('currentroom', socket.room);
                users[user].emit('info', 'Has cambiado a la sala ' + room + '.');
                socket.broadcast.to(socket.room).emit('info', socket.nickname + ' ha entrado a la sala.');
            }
        })
    });

    // Error de conexion
    socket.on('connect_error', function (message) {
        var user = users.indexOf(socket);
        users[user].emit('error', 'Error al conectar al chat.');
    });

    // Reconexion
    socket.on('reconnect', function (message) {
        var user = users.indexOf(socket);
        users[user].emit('info', 'Te has reconectado al chat.');
    });

    // Desconexion
    socket.on('disconnect', function() {
        var user = users.indexOf(socket);
        // Elimina al usuario del array al desconectarse
        console.log('Usuario desconectado: ' + socket.id);
        io.in(socket.room).emit('info', socket.nickname + ' se ha desconectado.');
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