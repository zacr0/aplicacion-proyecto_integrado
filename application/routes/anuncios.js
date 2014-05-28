var Anuncio = require('../models/Anuncio'),
	Usuario = require('../models/Usuario'),
	async = require('async'),
	route = function (app) {
	app.get('/anuncios', function(req, res) {
		// **** Importante éste codigo
		if (req.session.usuario) {
			var queryAnuncio = Anuncio.find().sort({fechaPublicacion: -1});

			queryAnuncio.exec( function (err, dataAnuncios) {
				if (dataAnuncios.length > 0) {
					async.series([
						function (callback) {
							dataAnuncios.forEach(function (elem, index, array) {
								Usuario.findOne({_id: elem.id_usuario},
												{_id: 1, usuario: 1, nombre: 1, apellidos: 1}, function (err, data) {
									datosUsuarios.push(data.usuario + ' ' + data.nombre + ' ' + data.apellidos);
									if( (index + 1) === array.length){
										callback();
									}
								}); // Usuario
							}); // dataAnuncios
						}, function (callback) {
							res.render('anuncios', {usuario: req.session.usuario,
								anuncios: dataAnuncios,
								usuarios: datosUsuarios});
						} // function
					]); // async.series

					console.log('Datos' + dataAnuncios[0].autor[0].usuario);
					console.log('Datos 2: ' + dataAnuncios);
					res.render('anuncios', {usuario: req.session.usuario,
						anuncios: dataAnuncios });
				} else {
					console.log("No hay anuncios");
					res.render('anuncios', {usuario: req.session.usuario});
				}
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}	
	}); // /get/anuncios

	// Publicacion de anuncios
	app.post('/anuncios', function(req, res) {
		if (req.session.usuario) {
			anuncio = new Anuncio();
			anuncio.titulo = req.body.titulo;
			anuncio.contenido = req.body.cuerpo;
			anuncio.fechaPublicacion = new Date();
			console.log(anuncio.fechaPublicacion);
			anuncio.fechaEdicion = null;

			async.series([
				function(callback){
					Usuario.findOne({'usuario': req.session.usuario}, {_id: 1},
						function(err, usuario) {
							if (err) {
								return console.log(err);
							};

							anuncio.id_usuario = usuario;
							console.log("usuario: " + usuario + ", _id: " + anuncio.id_usuario);
							callback();
						});
				}, function(callback) {
					anuncio.save( function(err) {
						if (err) {
							req.session.error = err;
							console.log('Error al publicar anuncio.');
							res.render('anuncios', {error: req.session.error});
							return console.log(err);
						}

						res.redirect('anuncios');
					}); // save
				}
			]); // async.series
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}
	}); // /post/anuncios
	
	app.post('/anuncios/:id/eliminar', function (req, res){

		if (req.session.usuario != undefined) {
			Anuncio.findByIdAndRemove(req.params.id, function (err, anuncio) {
				console.log('Va a eliminar el anuncio:' + anuncio);

				if (err) {
					return console.log(err);
				} else {
					console.log('Anuncio eliminado');
					res.redirect('/anuncios');
				}
			})
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}
	}); // post/eliminar
};

module.exports = route;