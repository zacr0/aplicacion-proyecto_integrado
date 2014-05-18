var route = function (app) {
	app.get('/', function(req, res) {
		res.render('index', { title: 'SocialGcap - Inicio' });
	});

	app.get('/login', function(req, res) {
		res.render('login', { title: 'SocialGcap - Iniciar sesión'});
	});

	app.get('/registro', function(req, res) {
		res.render('registro', { title: 'SocialGcap - Registro'});
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;
