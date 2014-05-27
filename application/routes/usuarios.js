var Usuario = require('../models/Usuario'),
	Promocion = require('../models/Promocion'),
	async = require('async'),
	query,

route = function (app) {
	app.get('/usuarios', function(req, res) {

		query = Usuario.find({},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
			.sort({nombre: 1, apellidos: 1});

		if (req.session.usuario != undefined) {
			query.exec(function (err, users) {
				res.render('usuarios', {usuario: req.session.usuario,
					usuarios: users,
					ver: 'usuarios'
				});
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	});

	app.get('/usuarios/alumnos', function(req, res) {

		query = Usuario.find({perfil: 'alumno'},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
			.sort({nombre: 1, apellidos: 1});

		if (req.session.usuario != undefined) {
			query.exec(function (err, users) {
				res.render('usuarios', {usuario: req.session.usuario,
					usuarios: users,
					ver: 'alumnos'
				});
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	});

	app.get('/usuarios/profesores', function(req, res) {

		query = Usuario.find({perfil: 'profesor'},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
			.sort({nombre: 1, apellidos: 1});

		if (req.session.usuario != undefined) {
			query.exec(function (err, users) {
				res.render('usuarios', {usuario: req.session.usuario,
					usuarios: users,
					ver: 'profesores'
				});
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}

	});

	app.get('/usuarios/promociones', function(req, res) {

		query = Promocion.find({}, {_id: 0}).sort({nombre: -1});
		var datosUsuarios = [];

		if (req.session.usuario != undefined) {
			query.exec( function (err, dataPromocion) {

				async.series([
					function (callback) {
						dataPromocion.forEach(function (elem, index, array) {
							Usuario.find({perfil: 'alumno', id_promocion: elem.id}, {nombre: 1}).exec(function (err, data) {
								datosUsuarios.push(data);
								if( (index+1) === array.length)
									callback();
							}); // Usuario
						}); // dataPromocion
					}, function (callback) {
						console.log(dataPromocion);
						res.render('usuarios', {usuario: req.session.usuario,
							promociones: dataPromocion,
							usuarios: datosUsuarios,
							ver: 'promociones'
						});
						//res.send('->' + dataPromocion + '\n\n ------>' + datosUsuarios);
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
