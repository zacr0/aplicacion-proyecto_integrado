var Usuario = require('../models/Usuario'),
	Curso = require('../models/Curso'),
	Promocion = require('../models/Promocion'),
	fs = require('fs'),
	nombrePromocion,
	nombreCurso,
	route = function (app) {
		app.get('/perfil', function (req, res) {
			// Redirige a su perfil si el usuario solo escribe /perfil
			if (req.session.usuario != undefined) {
				res.redirect('/perfil/' + req.session.usuario);
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		});

		app.get('/perfil/:usuario', function (req, res) {
			// Busca al usuario especificado en la url
			if (req.session.usuario != undefined) {
				Usuario.findOne({usuario: req.params.usuario}, function (err, user){
					if (err) {
	                	console.log('Error al buscar usuario en la BD');
	            	}

					// Control de existencia del usuario
	            	if (user) {
	            		var perfilPropio = false;

	            		// Comprobacion de perfil propio
	            		if (req.params.usuario === req.session.usuario) {
	            			perfilPropio = true;
	            		};

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
			            			nombrePromocion: nombrePromocion,
			            			perfilPropio: perfilPropio});
					            });
				           	});
	            		} else {
	            			// Usuario no es alumno
	            			res.render('perfil', {datosUsuario: user, 
	            				usuario: req.session.usuario,
	            				perfilPropio: perfilPropio});
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

		app.get('/perfil/editar/:usuario', function (req, res) {
			if (req.session.usuario != undefined) {
				if (req.session.usuario === req.params.usuario) {
					res.render('editar', {usuario: req.session.usuario});
				} else {
					res.redirect('/perfil');
				}
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
			}
		});

		app.post('/perfil/editar/:usuario', function (req, res) {
			if (req.session.usuario !== undefined) {

                if (req.files.image.mimetype != 'image/png' && 
            	req.files.image.mimetype != 'image/jpeg' &&
            	req.files.image.mimetype != 'image/gif') {
            		// Validacion de tipo de fichero
                	res.redirect('/perfil');
                	res.send(500, 'El fichero subido debe ser una imagen. <a href="/perfil/editar/' + req.session.usuario + '">Volver</a>');
                } else if (req.files.image.size >= 204800){
                	// Validacion de tamaño del fichero
                	res.redirect('/perfil');
                	res.send(500, 'La imagen supera el límite de 200KB. <a href="/perfil/editar/' + req.session.usuario + '">Volver</a>');
                } else {
                	fs.readFile(req.files.image.path, function (err, data) {
                		var newPath = __dirname + '/../public/img/' + req.session.usuario + '.' + req.files.image.extension;
                		console.log('data: ' + data.length);
                		fs.writeFile(newPath, data, function (err) {
                			Usuario.update({usuario: req.session.usuario}, {$set: {foto: '/img/' + req.session.usuario + '.' + req.files.image.extension}}, function (err, data) {
                				if (err) { throw err;}
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