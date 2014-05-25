var Usuario = require('../models/Usuario'),
	Curso = require('../models/Curso'),
	Promocion = require('../models/Promocion'),
	nombrePromocion,
	nombreCurso,
	route = function (app) {
		app.get('/perfil', function(req, res) {
			// Redirige a su perfil si el usuario solo escribe /perfil
			if (req.session.usuario) {
				res.redirect('/perfil/' + req.session.usuario);
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		});

		app.get('/perfil/:usuario', function(req, res) {
			// Busca al usuario especificado en la url
			if (req.session.usuario) {
				Usuario.findOne({usuario: req.params.usuario}, function (err, user){
					if (err) {
	                	console.log('Error al buscar usuario en la BD');
	            	}

					// Control de existencia del usuario
	            	if (user) {
	            		// Se obtiene informacion distinta en funcion del perfil
	            		if (user.perfil === 'alumno') {
	            			Promocion.findOne({_id: user.id_promocion}, function (err, promocion) {
	            			nombrePromocion = promocion.nombre; // Nombre promocion
	            			Curso.findOne({_id: user.id_curso}, function (err, curso) {
	            				nombreCurso = curso.nombre; // Nombre curso
			            		console.log('/perfil/usuario', user.usuario);

			            		res.render('perfil', {datosUsuario: user, 
			            			usuario: req.session.usuario,
			            			nombreCurso: nombreCurso,
			            			nombrePromocion: nombrePromocion});
					            });
				           	});
	            		} else {
	            			// Usuario no es alumno
	            			res.render('perfil', {datosUsuario: user, 
	            				usuario: req.session.usuario});
	            		}
	            	} else {
	            		res.render('perfil', {datosUsuario: user, 
	            			usuario: req.session.usuario,
	            			error: 'El usuario "' + req.params.usuario 
	            				+ '" no existe en la base de datos.'
	            		});
	            	}
				});
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGcap.'});
			}
		});
	};

module.exports = route;