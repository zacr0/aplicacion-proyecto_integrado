var Usuario = require('../models/Usuario'),
	Curso = require('../models/Curso'),
	Promocion = require('../models/Promocion'),
	Anuncio = require('../models/Anuncio'),
	fs = require('fs'),
	nombrePromocion,
	nombreCurso,
	route = function (app) {
		// Visualizacion del perfil
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
	
		// Edicion del perfil
		app.get('/perfil/:usuario/editar', function (req, res) {
			if (req.session.usuario != undefined) {
				if (req.session.usuario === req.params.usuario) {
					Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
						if (err) {
							return console.log(err);
						} else {
							res.render('editar', {datosUsuario: user, 
		            			usuario: req.session.usuario
		            		});

							//res.render('editar', {usuario: req.session.usuario});
						}
					});
				} else {
					res.redirect('/perfil');
				}
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
			}
		});

		// Actualizacion de imagen de perfil
		app.post('/perfil/:usuario/editar/foto', function (req, res) {
			if (req.session.usuario !== undefined) {

                if (req.files.image.mimetype != 'image/png' && 
            	req.files.image.mimetype != 'image/jpeg') {
            		// Validacion de tipo de fichero
                	res.render('editar', {usuario: req.session.usuario,
                		error: 'El fichero subido debe ser una imagen con formato .jpg o .png.'});
                } else if (req.files.image.size >= 204800){
                	// Validacion de tamaño del fichero
                	res.render('editar', {usuario: req.session.usuario,
                		error: 'La imagen supera el límite de 200KB, utilice una imagen más pequeña.'});
                } else {
                	fs.readFile(req.files.image.path, function (err, data) {
                		var newPath = __dirname + '/../public/img/' + req.session.usuario + '.' + req.files.image.extension;
                		console.log('data: ' + data.length);
                		fs.writeFile(newPath, data, function (err) {
                			Usuario.update({usuario: req.session.usuario}, {$set: {foto: '/img/' + req.session.usuario + '.' + req.files.image.extension}}, function (err, data) {
                				if (err) { throw err;}
                				res.render('editar', {usuario: req.session.usuario,
                					success: true});
                			}); // Usuario
                        }); // writeFile
                    }); // readFile
                }
            } else {
            	res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
            }
        });
		
		// Actualizacion de datos de usuario
		app.post('/perfil/:usuario/editar/datos', function (req, res) {

		});

		// Visualizacion de anuncios publicados por el usuario
		app.get('/perfil/:usuario/anuncios', function (req, res) {
			if (req.session.usuario != undefined) {
				// Consulta del anuncios del usuario
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
			}
		});
	};

module.exports = route;