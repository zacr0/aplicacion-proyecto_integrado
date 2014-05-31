$(function() {
	var socket = io(),
		nickPropio = $('#perfilusuario').text()
			.substr(9, $('#perfilusuario').text().length);

	// Envio de nickname del usuario
	socket.emit('nickname', nickPropio);

	// Envio de mensajes
	$('#form-mensaje').submit(function (e) {
		var nickname = $('#perfilusuario').text()
						.substr(9, $('#perfilusuario').text().length);

		socket.emit('message', nickname, $('#mensaje').val() );
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
								+ ': </strong>' + message + '</p>'));
		} else {
			$('#chat').append($('<p class="msg bg-info"><strong>' + nickname 
								+ ': </strong>' + message + '</p>'));
		}
		
		$('#chat').animate({ scrollTop: $(document).height() }, 1000);
	});

	// Mensajes de informacion
	socket.on('info', function (message) {
		$('#chat').append($('<p class="msg text-success"><strong>' + message 
								+ '</strong>'));
	});

	// Mensajes de errores
	socket.on('error', function (message) {
		$('#chat').append($('<p class="msg text-danger"><strong>' + message 
								+ '</strong>'));
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
		console.log('Cambio de sala');
		return false;
	});
});