var route = function (app) {
	app.get('/', function(req, res) {
		req.session.name = "Prueba";
		res.render('index');
	});

	app.get('/login', function(req, res) {
		res.render('login', {name: req.session.name});
		//res.render('index', { title: 'SocialGcap - Inicio' });
	});

	app.get('/registro', function(req, res) {
		res.render('registro', { title: 'SocialGcap - Registro'});
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;
