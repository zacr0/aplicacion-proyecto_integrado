module.exports = function(io) {
    var users = [],
        usersRooms = [],
        Promocion = require('./models/Promocion'),
        Asignatura = require('./models/Asignatura'),
        sanitizeHtml = require('sanitize-html'),
        rooms = ['Pasillo',
        'Sala de profesores',
        'La Chaty'];

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
            /* Limpia el contenido del mensaje recibido, permitiendo
                unicamente etiquetas de enfasis y enlaces
            */
            var cleanMessage =  sanitizeHtml(message, {
                allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
                allowedAttributes: {
                    'a': [ 'href' ]
                }
            });

            // Manda el mensaje limpio
            io.in(socket.room).emit('message', socket.nickname, cleanMessage);
        });

        // Nombre de usuario
        socket.on('nickname', function(nickname) {
            socket.nickname = nickname;
            // Introduce el nickname en el array de usuario / sala
            usersRooms.push([socket.nickname, socket.room]);
            // Informa a la sala de la conexion
            socket.broadcast.to(socket.room).emit('info', socket.nickname + ' se ha conectado.');
            console.log('Nombre de usuario: ' + socket.nickname);
            console.log(usersRooms);
            // Manda la lista de los usuarios a la sala anterior
            io.in(socket.room).emit('userlist', getUsersInRoom(socket.room));
        });

        // Cambio de sala
        socket.on('switchroom', function (room) {
            var user = users.indexOf(socket);
            var previousRoom = socket.room;
            // Informa a los usuarios de la sala anterior
            socket.broadcast.to(socket.room).emit('info', socket.nickname + ' ha cambiado de sala.');
            // Desconecta al usuario de la sala actual
            socket.leave(socket.room);
            // Establece la nueva sala
            socket.room = room;
            // Conecta a la nueva sala
            socket.join(room, function (err) {
                if (err) {
                    users[user].emit('error', 'Error al conectar a la sala.');
                } else {
                    console.log('Usuario: ' + socket.nickname + ' cambia a la sala '
                       + room);
                    console.log(getUsersInRoom(socket.room));
                    // Actualiza la sala del usuario en el array
                    usersRooms[user][1] = room;
                    // Manda la lista de usuarios en la sala
                    io.in(room).emit('userlist', getUsersInRoom(room));
                    console.log(getUsersInRoom(socket.room));
                    // Manda la lista de los usuarios a la sala anterior
                    io.in(previousRoom).emit('userlist', getUsersInRoom(previousRoom));
                    // Informa a los usuarios
                    users[user].emit('currentroom', socket.room);
                    users[user].emit('info', 'Has cambiado a la sala ' + room + '.');
                    socket.broadcast.to(socket.room).emit('info', socket.nickname + ' ha entrado en la sala.');
                }
            });
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
            // Actualize los arrays
            users.splice(user, 1);
            usersRooms.splice(user,1);
            // Manda la lista de los usuarios a la sala anterior
            io.in(socket.room).emit('userlist', getUsersInRoom(socket.room));
        });
    });
    
    // Obtiene los usuarios en una sala
    function getUsersInRoom(room) {
        var userList = [];
        for (var i = 0; i < usersRooms.length; i++) { 
            if (usersRooms[i][1] === room) {
                userList.push(usersRooms[i][0]);
            }
        };
        return userList;
    }
}
