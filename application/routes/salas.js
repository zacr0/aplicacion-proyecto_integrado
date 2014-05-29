var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
	route = function (app) {
		app.get('/salas', function(req, res) {

			if (req.session.usuario != undefined) {
				res.render('salas', {usuario: req.session.usuario});

			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}

		});
	}

module.exports = route;