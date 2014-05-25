var Anuncio = require('../models/Anuncio'),
	Usuario = require('../models/Usuario'),
	async = require('async'),
	datosUsuarios = [],

route = function (app) {
	app.get('/anuncios', function(req, res) {

		var queryAnuncio = Anuncio.find().sort({fecha_publicacion: -1});

		// **** Importante éste código
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
								if( (index+1) === array.length)
									callback();
							}); // Usuario
						}); // dataAnuncio
					}, function (callback) {
						res.send('->' + dataAnuncio + '\n\n ------>' + datosUsuarios);
					} // function
				]); // async.series
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
		
	});

	// Publicación de anuncios
	app.post('/anuncios', function(req, res) {

	});
}

module.exports = route;