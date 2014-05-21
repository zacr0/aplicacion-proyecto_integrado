var route = function (app) {
	app.get('/perfil', function(req, res) {
		
		if (req.session.usuario) {
			res.render('perfil');
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});
}

module.exports = route;