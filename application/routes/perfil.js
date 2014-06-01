var Usuario = require('../models/Usuario'),
	Curso = require('../models/Curso'),
	Promocion = require('../models/Promocion'),
	fs = require('fs'),
	nombrePromocion,
	nombreCurso,
	route = function (app) {
		app.get('/perfil', function(req, res) {
			// Redirige a su perfil si el usuario solo escribe /perfil
			if (req.session.usuario != undefined) {
				res.redirect('/perfil/' + req.session.usuario);
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		});

		app.get('/perfil/:usuario', function(req, res) {
			// Busca al usuario especificado en la url
			if (req.session.usuario != undefined) {
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
					'para acceder a SocialGCap.'});
			}
		});

		app.post('/perfil/editar/:usuario', function(req, res) {
			if (req.session.usuario !== undefined) {
				// IMPORTANTE EN EL app.js donde ponga: NUEVO
				// TODAVIA NO ESTA FINIQUITADO
				console.log(req.files.image.size);
				if(req.files.image.size >= 204800){
					console.log('ES MENOR');
					res.render('/perfil/' + req.session.usuario, {error: 'Debes iniciar sesión para acceder a SocialGCap.'});
				}else{
					console.log('ES MAYOR');
					fs.readFile(req.files.image.path, function (err, data) {
						var newPath = __dirname + '/../public/img/' + req.session.usuario + '.' + req.files.image.extension;
						console.log('data: ' + data.length);
					  	fs.writeFile(newPath, data, function (err) {
					  		Usuario.update({usuario: req.session.usuario}, {$set: {foto: '/img/' + req.session.usuario + '.' + req.files.image.extension}}, function (err, data) {
					  			if(err) { throw err;}
					    		res.redirect('/perfil/' + req.session.usuario);
					  		}); // Usuario
					  	}); // writeFile
				  	}); // readFile
				}
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		});
	};

module.exports = route;