var route = function (app) {
	app.get('/anuncios', function(req, res) {
		res.send('Para los anuncios');
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;