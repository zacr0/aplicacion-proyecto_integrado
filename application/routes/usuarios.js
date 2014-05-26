var Usuario = require('../models/Usuario'),
	Promocion = require('../models/Promocion'),
	async = require('async'),
	query,

route = function (app) {
	app.get('/usuarios', function(req, res) {

		query = Usuario.find({},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
			.sort({nombre: 1, apellidos: 1});

		if (req.session.usuario) {
			query.exec(function (err, users) {
				console.log(users);
				res.render('usuarios', {usuario: req.session.usuario,
					usuarios: users
				});
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	});

	app.get('/usuarios/alumnos', function(req, res) {

		query = Usuario.find({perfil: 'alumno'}).sort({nombre: 1, apellidos: 1});

		if (req.session.usuario) {
			query.exec(function (err, users) {
				res.render('usuarios', {usuario: req.session.usuario,
					usuarios: users
				});
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	});

	app.get('/usuarios/profesores', function(req, res) {

		query = Usuario.find({perfil: 'profesor'}).sort({nombre: 1, apellidos: 1});

		if (req.session.usuario) {
			query.exec(function (err, users) {
				res.render('usuarios', {usuario: req.session.usuario,
					usuarios: users
				});
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	});

	app.get('/usuarios/promociones', function(req, res) {

		query = Promocion.find().sort({nombre: -1});
		var datosUsuarios = [];

		// **** Importante éste código
		if (req.session.usuario) {
			query.exec( function (err, dataPromocion) {

				async.series([
					function (callback) {
						dataPromocion.forEach(function (elem, index, array) {
							/*console.log('elem: ' + elem
								+ '\nindex: ' + index
								+ '\narray: ' + array);*/
							Usuario.find({perfil: 'alumno', id_promocion: elem.id}).exec(function (err, data) {
								datosUsuarios.push(data);
								if( (index+1) === array.length)
									callback();
							}); // Usuario
						}); // dataPromocion
					}, function (callback) {
						res.send('->' + dataPromocion + '\n\n ------>' + datosUsuarios);
					} // function
				]); // async.series
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	}); // /usuarios/promociones
}

module.exports = route;
