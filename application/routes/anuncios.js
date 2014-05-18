var route = function (app) {
	app.get('/anuncios', function(req, res) {
		res.render('anuncios');
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;