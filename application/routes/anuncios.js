var Anuncio = require('../models/Anuncio'),
	Usuario = require('../models/Usuario'),
	async = require('async'),
	anuncio,
	datosUsuarios = [],
	route = function (app) {
	app.get('/anuncios', function(req, res) {
		var queryAnuncio = Anuncio.find().sort({fecha_publicacion: -1});

		// **** Importante éste codigo
		if (req.session.usuario) {
			queryAnuncio.exec( function (err, dataAnuncio) {
				async.series([
					function (callback) {
						dataAnuncio.forEach(function (elem, index, array) {
							/*console.log('elem: ' + elem
								+ '\nindex: ' + index
								+ '\narray: ' + array);*/
							Usuario.find({_id: elem.id_usuario}, function (err, data) {
								datosUsuarios.push(data);
								if( (index + 1) === array.length){
									callback();
								}
							}); // Usuario
						}); // dataAnuncio
					}, function (callback) {
						res.send('->' + dataAnuncio + '\n\n ------>' + datosUsuarios);
					} // function
				]); // async.series
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}	
	});

	// Publicacion de anuncios
	app.post('/anuncios', function(req, res) {
		anuncio = new Anuncio();
		anuncio.titulo = req.body.titulo;
		anuncio.contenido = req.body.cuerpo;
		anuncio.fechaPublicacion = new Date();
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
					})
			}, function(callback) {
				anuncio.save( function(err) {
					if (err) {
						req.session.error = err;
						console.log('Error al publicar anuncio.');
						res.render('anuncios', {error: req.session.error});
						return console.log(err);
					}

					res.render('anuncios', {success: true});
				}) // save
			}
		]) // async.series
	})
}

module.exports = route;