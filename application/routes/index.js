var route = function (app) {
	app.get('/', function(req, res) {
		res.render('index');
	});

	app.get('/login', function(req, res) {
		res.render('login');
	});

	app.get('/registro', function(req, res) {
		res.render('registro');
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;
