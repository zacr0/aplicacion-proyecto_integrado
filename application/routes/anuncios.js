var route = function (app) {
	app.get('/anuncios', function(req, res) {
		res.render('anuncios', {title: 'SocialGcap - Anuncios'});
	});

	/* AQUI FALTA EL APARTADO POST DEL REGISTRO */
}

module.exports = route;