module.exports = function(io) {

    // socket.io (seria apropiado exportar a otro fichero)
    var users = [],
        Promocion = require('./models/Promocion'),
        rooms = ['Pasillo',
        'Sala de profesores',
        'La Chaty'],
        // Obtencion e insercion de salas de promociones
        query = Promocion.find({}, {_id: 0});   

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

    io.on('connection', function (socket) {
        // Introducimos al usuario en la sala por defecto
        socket.room = rooms[0];
        //console.log('sesion: ' + session);

        // Introduce la id del usuario en el array de usuarios
        users.push(socket);
        //console.log(socket.conn);
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

        // Informa a la sala de la conexion

        socket.on('nickname', function (nickname) {
            socket.broadcast.to(socket.room).emit('info', 'Se ha conectado ' + nickname);
        });

        // Envio de mensajes a la sala del usuario
        socket.on('message', function (nickname, message) {
            io.in(socket.room).emit('message', nickname, message);
        });

        // Cambio de sala
        socket.on('switchroom', function (room) {
            var user = users.indexOf(socket);
            // Desconecta al usuario de la sala actual
            socket.leave(socket.room);
            io.in(socket.room).emit('info', 'Un usuario se ha desconectado.');
            // Conecta al usuario a la nueva sala
            socket.room = room;
            socket.join(room, function (err) {
                if (err) {
                    users[user].emit('error', 'Error al conectar a la sala.');
                } else {
                    console.log('Usuario: ' + socket.id + ' cambia a la sala '
                         + room);
                    users[user].emit('currentroom', socket.room);
                    users[user].emit('info', 'Te has cambiado a la sala ' + room + '.');
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
            users.splice(user, 1);
       });
    });
}