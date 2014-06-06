var Usuario = require('../models/Usuario'),
	Curso = require('../models/Curso'),
	Promocion = require('../models/Promocion'),
	Anuncio = require('../models/Anuncio'),
	Asignatura = require('../models/Asignatura'),
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
		}); // app.get/perfil

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
		}); // app.get/perfil/usuario
	
		// Pagina de edicion del perfil
		app.get('/perfil/:usuario/editar', function (req, res) {
			if (req.session.usuario != undefined) {
				if (req.session.usuario === req.params.usuario) {

					Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
						if (err) {
							return console.error(err);
						} else {
							res.render('editar', {datosUsuario: user, 
		            			usuario: req.session.usuario
		            		});
						}
					});
				} else {
					res.redirect('/perfil');
				}
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
			}
		});  // app.get/perfil/usuario/editar

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
                	Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
                		if (err) {
                			return console.error(err)
                		} else {
                			res.render('editar', {usuario: req.session.usuario,
                				datosUsuario: user,
                				error: 'La imagen supera el límite de 200KB, utilice una imagen más pequeña.'
                			});
                		}
                	});
                } else {
                	var fileToDelete = __dirname + '/../public/img/' + req.session.usuario + '.';
                	
                	if (req.files.image.mimetype === 'image/png'){
                		console.log(fileToDelete + 'jpg');
						fs.exists(fileToDelete + 'png' || fileToDelete + 'jpeg', function (exists) {
						    if(exists) {
						    	var tempFile = fs.openSync(fileToDelete + 'jpg' || fileToDelete + 'jpeg', 'r');
								fs.closeSync(tempFile);
								fs.unlinkSync(fileToDelete + 'jpg' || fileToDelete + 'jpeg');
						    }
					    }); // fs.exist
                	}

                	if (req.files.image.mimetype === 'image/jpeg'){
                		console.log(fileToDelete + 'png');
                		fs.exists(fileToDelete + 'png', function (exists) {
						    if(exists) {
						    	var tempFile = fs.openSync(fileToDelete + 'png', 'r');
								fs.closeSync(tempFile);
								fs.unlinkSync(fileToDelete + 'png');
						    }
					    }); // fs.exist
                	}
                	
                	fs.readFile(req.files.image.path, function (err, data) {
                		var newPath = __dirname + '/../public/img/' + req.session.usuario + '.' + req.files.image.extension;
                		console.log('data: ' + data.length);
                		fs.writeFile(newPath, data, function (err) {
                			Usuario.update({usuario: req.session.usuario}, {$set: {foto: '/img/' + req.session.usuario + '.' + req.files.image.extension}}, function (err, data) {
                				if (err) { console.error(err);}
                				Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
                					if (err) {
                						return console.error(err);
                					} else {
		                				res.render('editar', {usuario: req.session.usuario,
		                					datosUsuario: user,
		                					success: true
		                				});
                					}
                				})
                			}); // Usuario
                        }); // writeFile
                    }); // readFile
                }
            } else {
            	res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
            }
        }); // app.post/perfil/usuario/editar/foto
		
		// Actualizacion de datos de usuario
		app.post('/perfil/:usuario/editar/datos', function (req, res) {
			Usuario.findOne({usuario : req.params.usuario}, function (err, user){
				if (err) {
					return console.error(err);
				}
				
				if (req.body.pass === user.pass){
					Usuario.update( { usuario : req.params.usuario }, { $set : { email : req.body.email , fechaNacimiento: req.body.fechaNacimiento, pass: req.body.newPassword || req.body.pass} },
						function (err, data) {
							if (err) {
								return console.error(err);
							}
			        		res.render('editar', {usuario: req.session.usuario,
			        			datosUsuario: user,
			        			success: true
			        		});
					}); // Usuario.update
				} else {
					res.render('editar', {usuario: req.session.usuario,
    					datosUsuario: user,
    					error: 'La contraseña actual introducida no es correcta. Inténtelo de nuevo.'
		        	});
				} // else
			}); // Usuario
		}); // app.post/editar/datos

		// Visualizacion de anuncios publicados por el usuario
		app.get('/perfil/:usuario/anuncios', function (req, res) {
			
			if (req.session.usuario != undefined) {
				// Control de existencia de usuario
				Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
					if (err) {
						return console.error(err);
					} else {
						if (user) {
							var perfilPropio = false;

							if (req.session.usuario === req.params.usuario) {
								perfilPropio = true;
							}
							// Consulta del anuncios del usuario
							var query = Anuncio.find({"autor.usuario": req.params.usuario},
													{"titulo": 1, "contenido": 1, "fechaPublicacion": 1})
												.sort({fechaPublicacion: -1});
							query.exec(function (err, anuncios) {
								if (err) {
									return console.error(err);
								} else {
									res.render('anuncios-perfil', {usuario: req.session.usuario,
										perfilDe: req.params.usuario,
										perfilPropio: perfilPropio,
										anuncios: anuncios,
										perfil: req.session.perfil
									});
								}
							});
						} else {
							// El usuario no existe
							res.redirect('/perfil/' + req.params.usuario);
						}
					}
				});
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
            		'para acceder a SocialGCap.'});
			}
		}); // app.get/usuario/anuncios

		// Eliminacion de anuncios desde perfil del usuario
		app.post('/perfil/:usuario/anuncios/:id/eliminar', function (req, res){
			if (req.session.usuario != undefined) {
				Anuncio.findByIdAndRemove(req.params.id, function (err, anuncio) {
					console.log('Va a eliminar el anuncio:' + anuncio);
					if (err) {
						return console.error(err);
					} else {
						console.log('Anuncio eliminado');
						res.redirect('/perfil/' + req.params.usuario + '/anuncios');
					}
				})
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		}); // app.post/usuario/anuncios/id/eliminar

		// Pagina de edicion de asignaturas
		app.get('/perfil/:usuario/editar/asignaturas', function (req, res) {
			if (req.session.usuario != undefined) {
				if (req.session.usuario === req.params.usuario &&
					req.session.perfil === 'profesor') {
					var queryAsignaturas = Asignatura.find().sort( { "nombre": 1 } );
					queryAsignaturas.exec(function (err, asignaturas) {
						if (err) {
							return console.error(err);
						} else {
							Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
								if (err) {
									return console.error(err);
								} else {
									res.render('editar-profesor', {usuario: req.session.usuario,
										datosUsuario: user,
										asignaturas: asignaturas
									});
								}
							})
						}
					})
				} else {
					res.redirect('/perfil');
				}
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
						'para acceder a SocialGCap.'});
			}
		});	// app.get/perfil/usuario/editar/asignaturas

		// Actualizacion de asignaturas impartidas
		app.post('/perfil/:usuario/editar/asignaturas', function (req, res) {
			if (req.session.usuario != undefined) {
				if (req.session.usuario === req.params.usuario &&
					req.session.perfil === 'profesor') {
						Usuario.update({usuario: req.params.usuario},{$set: {asignaturasProfesor: req.body.asignatura || []}}, function (err, data) {
	        				if (err) { throw err;}
	        				Usuario.findOne({usuario: req.params.usuario}, function (err, user) {
	        					if (err) {
	        						return console.error(err);
	        					} else {
	        						console.log(user.asignaturasProfesor);
	        						var queryAsignaturas = Asignatura.find().sort( { "nombre": 1 } );
	        						queryAsignaturas.exec(function (err, asignaturas) {
	        							if (err) {
	        								return console.error(err);
	        							} else {
	        								res.render('editar-profesor', {usuario: req.session.usuario,
			                					datosUsuario: user,
			                					asignaturas: asignaturas,
			                					success: true
			                				});
	        							}
	        						})
	                				
	        					}
	        				})
	                	}); // Usuario
				} else {
					res.redirect('/perfil');
				}
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
						'para acceder a SocialGCap.'});
			}
		}); // app.post/usuario/editar/asignaturas
	};


module.exports = route;