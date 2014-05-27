var Anuncio = require('../models/Anuncio'),
	Usuario = require('../models/Usuario'),
	async = require('async'),
	route = function (app) {
	app.get('/anuncios', function(req, res) {
		var queryAnuncio = Anuncio.find().sort({fechaPublicacion: -1});

		// **** Importante éste codigo
		if (req.session.usuario) {
			queryAnuncio.exec( function (err, dataAnuncios) {
				if (dataAnuncios.length > 0) {
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
	});

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
	});
};

module.exports = route;