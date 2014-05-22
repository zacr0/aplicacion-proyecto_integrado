var route = function (app) {
	app.get('/usuarios', function(req, res) {

		if (req.session.usuario) {
			res.render('usuarios', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}

	});
}

module.exports = route;
