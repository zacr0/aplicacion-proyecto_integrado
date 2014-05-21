var route = function (app) {
	app.get('/anuncios', function(req, res) {

		if (req.session.usuario) {
			res.render('anuncios');
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}

	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;