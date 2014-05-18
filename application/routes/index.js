var route = function (app) {
	app.get('/', function(req, res) {
		res.send('Página principal');
	});

	app.get('/login', function(req, res) {
		res.send('Ruta para el login');
	});

	app.get('/registro', function(req, res) {
		res.send('Registro');
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;
