var route = function (app) {
	app.get('/anuncios', function(req, res) {

		if (req.session.usuario) {
			res.render('anuncios', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGCap.'});
		}
		
	});

	// Publicación de anuncios
	app.post('/anuncios', function(req, res) {

	});
}

module.exports = route;