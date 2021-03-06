var Anuncio = require('../models/Anuncio'),
	Usuario = require('../models/Usuario'),
	sanitizeHtml = require('sanitize-html'),
	async = require('async'),
	route = function (app) {
		app.get('/anuncios', function(req, res) {

			if (req.session.usuario != undefined) {
				var page,
					pages,
					totalResults,
					queryAnuncio,
	        		querystring = req.url.replace(/(\&)?(\?)?page=.+(\&)?/,''),
	        		queryparams = querystring.split('?').length > 1  && querystring.split('?')[1] !== "";

				async.series([
					function (callback) {
					  	Anuncio.find().count(function (err, count) {
					  		if (err) {
					  			req.flash('error', err);
					  			return res.redirect("/");
					  		}
					  		totalResults = count;
					  		console.log('Numero total anuncios: ' + totalResults);
					  		callback();
					    });
					}, function (callback) {
						page = req.query.page || 1;
						pages = Math.ceil(totalResults / 20);
						
						if (page > pages || req.query.page < 1 || isNaN(page)) {
							page = 1;
						}

						queryAnuncio = Anuncio.find().sort({fechaPublicacion: - 1})
													.skip((page - 1) * 20).limit(20);

						queryAnuncio.exec( function (err, dataAnuncios) {
							if (dataAnuncios.length > 0) {
								res.render('anuncios', {usuario: req.session.usuario,
									querystring: querystring, 
									queryparams: queryparams,
									page: page, 
									pages: Math.ceil(totalResults / 20),
									anuncios: dataAnuncios });
							} else {
								console.log("No hay anuncios");
								res.render('anuncios', {usuario: req.session.usuario});
							}
						});
					} // callback
				]);
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}	
		}); // app.get/anuncios

		// Publicacion de anuncios
		app.post('/anuncios', function(req, res) {

			if (req.session.usuario != undefined) {
				// Limpieza del contenido introducido
				var cleanTitulo =  sanitizeHtml(req.body.titulo, {
					allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
					allowedAttributes: {
						'a': [ 'href' ]
					}
				});
				var cleanCuerpo =  sanitizeHtml(req.body.cuerpo, {
					allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
					allowedAttributes: {
						'a': [ 'href' ]
					}
				});

				anuncio = new Anuncio();
				anuncio.titulo = cleanTitulo;
				anuncio.contenido = cleanCuerpo;
				anuncio.fechaPublicacion = new Date();
				anuncio.fechaEdicion = null;
				anuncio.autor = { 'usuario': req.session.usuario,
								  'nombre': req.session.nombre,
								  'apellidos': req.session.apellidos
								};

				async.series([
					function (callback){
						Usuario.findOne({'usuario': req.session.usuario}, {_id: 1},
							function (err, usuario) {
								if (err) {
									return console.error(err);
								} else {
									anuncio.id_usuario = usuario;
									console.log("usuario: " + usuario + ", _id: " + anuncio.id_usuario);
									callback();
								}
							});
					}, function (callback) {
						anuncio.save( function (err) {
							if (err) {
								req.session.error = err;
								console.log('Error al publicar anuncio.');
								res.render('anuncios', {error: req.session.error});
								return console.error(err);
							}

							res.redirect('anuncios');
						}); // save
					}
				]); // async.series
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		}); // app.post/anuncios
		
		// Eliminacion de anuncios
		app.post('/anuncios/:id/eliminar', function (req, res){
			if (req.session.usuario != undefined) {
				Anuncio.findByIdAndRemove(req.params.id, function (err, anuncio) {
					console.log('Va a eliminar el anuncio:' + anuncio);

					if (err) {
						return console.error(err);
					} else {
						console.log('Anuncio eliminado');
						res.redirect('/anuncios');
					}
				})
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}
		}); // app.post/anuncios/eliminar
	};

module.exports = route;