var route = function (app) {
	//app.get('/perfil/:usuario', function(req, res) {
	app.get('/perfil', function(req, res) {
		// req.params.usuario
		// Comparar la url con el usuario conectado
		if (req.session.usuario) {
			res.render('perfil', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});
}

module.exports = route;