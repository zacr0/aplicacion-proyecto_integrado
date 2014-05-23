var route = function (app) {
	app.get('/perfil', function(req, res) {
		
		if (req.session.usuario) {
			res.render('perfil', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});

	app.get('/perfil/:usuario', function(req, res) {
		console.log('ESTAS EN TU USUARIO');
		if (req.session.usuario) {
			res.render('perfil', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});
}

module.exports = route;