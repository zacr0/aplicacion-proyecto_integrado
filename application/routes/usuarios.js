var Usuario = require('../models/Usuario'),
	Promocion = require('../models/Promocion'),
	async = require('async'),
	url = require('url'),
	query,
	route = function (app) {
		app.get('/usuarios', function(req, res) {

			if (req.session.usuario != undefined) {
				query = Usuario.find({},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
								.sort({nombre: 1, apellidos: 1});

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

		}); // app.get/usuarios

		app.get('/usuarios/alumnos', function(req, res) {

			if (req.session.usuario != undefined) {
				query = Usuario.find({perfil: 'alumno'},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
								.sort({nombre: 1, apellidos: 1});

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

		}); // app.get/usuarios/alumnos

		app.get('/usuarios/profesores', function(req, res) {

			if (req.session.usuario != undefined) {
				query = Usuario.find({perfil: 'profesor'},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
								.sort({nombre: 1, apellidos: 1});

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

		}); // app.get/usuarios/profesores

		app.get('/usuarios/promociones', function(req, res) {

			if (req.session.usuario != undefined) {
				query = Promocion.find({}, {_id: 0}).sort({nombre: -1});

				query.exec( function (err, dataPromocion) {
					if (err) {
						return console.log(err);
					} else {
						res.render('usuarios', {usuario: req.session.usuario,
							promociones: dataPromocion,
							ver: 'promociones'});
					}
				});
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}

		}); // app.get/usuarios/promociones

		app.get('/usuarios/promociones/:promocion', function(req, res) {

			if (req.session.usuario != undefined) {
				query = Promocion.findOne({"nombre": req.params.promocion});

				query.exec(function (err, dataPromocion) {
					if(err){
	                  return console.log(err);
					} else {
						Usuario.find({"id_promocion": dataPromocion},
										{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0},
										function (err, dataUsers) {
							res.render('usuarios', {usuario: req.session.usuario,
								promociones: dataPromocion,
								usuarios: dataUsers,
								ver: req.params.promocion});
						});
					}
				});
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}

		}); // app.get/usuarios/promociones/promocion

		app.post('/usuarios/buscar', function (req, res) {
			
			if (req.session.usuario != undefined) {
				query = Usuario.find({},{_id: 0, fechaNacimiento: 0, email: 0, pass: 0, asignaturasProfesor: 0})
								.or([{'usuario': {$regex: new RegExp(req.body.buscador, "i")}}, 
									{'nombre': {$regex: new RegExp(req.body.buscador, "i")}}, 
									{'apellidos': { $regex: new RegExp(req.body.buscador, "i")}}])
								.sort({nombre: 1, apellidos: 1});

				query.exec(function (err, users) {
					if (err) {
						return console.log(err);
					}

					if (users) {
						res.render('usuarios', {
							usuario: req.session.usuario,
							usuarios: users,
							ver: 'usuarios encontrados'
						});
					} else {
						res.render('usuarios', {
							usuario: req.session.usuario,
							ver: 'usuarios encontrados'
						});
					}
				});
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		}); // app.post/usuarios/buscar
	}

module.exports = route;
