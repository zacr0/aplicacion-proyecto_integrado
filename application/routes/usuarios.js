var Usuario = require('../models/Usuario'),
	Promocion = require('../models/Promocion'),

route = function (app) {
	app.get('/usuarios', function(req, res) {

		if (req.session.usuario) {
			//res.render('usuarios', {usuario: req.session.usuario});
			Usuario.find(function (err, user) {
				console.log('usuarios: ' + user);
				res.send('aaaaaaaa' + user);
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}

	});

	app.get('/usuarios/alumnos', function(req, res) {

		if (req.session.usuario) {
			Usuario.find(function (err, user) {
				console.log('usuarios: ' + user);
				res.send('aaaaaaaa' + user);
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}

	});

	app.get('/usuarios/profesores', function(req, res) {

		if (req.session.usuario) {
			Usuario.find({perfil: 'profesor'},function (err, user) {
				console.log('usuarios: ' + user);
				res.send('aaaaaaaa' + user);
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}

	});

	app.get('/usuarios/promociones', function(req, res) {

		var queryPromocion = Promocion.find().sort({nombre: -1});

		// **** Importante éste código
		if (req.session.usuario) {
			queryPromocion.exec( function (err, dataPromocion) {
				dataPromocion.forEach(function (elem, index, array) {
					console.log('elem: ' + elem
						+ '\nindex: ' + index
						+ '\narray: ' + array);
					Usuario.find({perfil: 'alumno', id_promocion: elem.id}).exec(function (err, data) {
						res.send('->' + dataPromocion +
							+ '\n\n' + data);
					});
				});
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}

	});
}

module.exports = route;
