$(function() {
	var nickname = $('#perfilusuario').text()
						.substr(9, $('#perfilusuario').text().length);
	var socket = io();

	// Envia nombre de usuario
	socket.emit('nickname', nickname);

	// Envio de mensajes
	$('#form-mensaje').submit(function (e) {
		socket.emit('message', $('#mensaje').val() );
		$('#mensaje').val('');
		$('#chat').animate({ scrollTop: $(document).height() }, 1000);
		return false;
	});
		
	// Recepcion de mensajes
	socket.on('message', function (nickname, message) {
		var nickPropio = $('#perfilusuario').text()
						.substr(9, $('#perfilusuario').text().length);
		
		if (nickname === nickPropio) {
			$('#chat').append($('<p class="msgPropio bg-success"><strong>' + nickname 
								+ ': </strong>' + Autolinker.link(message) + '</p>'));
		} else {
			$('#chat').append($('<p class="msg bg-info"><strong>' + nickname 
								+ ': </strong>' + Autolinker.link(message) + '</p>'));
		}
		
		$('#chat').animate({ scrollTop: $(document).height() }, 1000);
	});

	// Mensajes de informacion
	socket.on('info', function (message) {
		$('#chat').append($('<p class="msg text-success"><strong>' + message 
								+ '</strong>'));
		$('#chat').animate({ scrollTop: $(document).height() }, 1000);
	});

	// Mensajes de errores
	socket.on('error', function (message) {
		$('#chat').append($('<p class="msg text-danger"><strong>' + message 
								+ '</strong>'));
		$('#chat').animate({ scrollTop: $(document).height() }, 1000);
	});

	// Recepcion de salas
	socket.on('rooms', function (rooms) {
		$.each(rooms, function(index, room) {
			$('#lista-salas ul').append($('<li> - <a href="#" ' 
				+ 'title="Entrar a la sala ' + room +'">' + room + '</a></li>'));
		});
	});

	// Sala actual
	socket.on('currentroom', function (room) {
		$('#nombre-sala').text(room);
	});

	// Cambio de salas al hacer click
	$('#lista-salas').on("click", "a", function() {
		$('#chat').empty();
		socket.emit('switchroom', $(this).text());
		return false;
	});

	// Listado de usuarios en la sala actual
	socket.on('userlist', function (userlist) {
		$('#lista-usuarios ul').empty();
		$.each(userlist, function (index, user) {
			$('#lista-usuarios ul').append($('<li> - <a href="/perfil/' + user + '" ' 
				+ 'title="Ir al perfil de ' + user +'" target="_blank">' + user + '</a></li>'));
		});
	});
});