var route = function (app) {
	app.get('/usuarios', function(req, res) {
		res.render('usuarios', {title: 'SocialGcap - Usuarios'});
	});
}

module.exports = route;
