var route = function (app) {
	/* NO definitivo */
	app.get('/salas/:id', function(req, res) {
		res.send('Página principal');
	});
}

module.exports = route;