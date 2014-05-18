var route = function (app) {
	app.get('/perfil/:id', function(req, res) {
		res.send('Página principal');
	});
}

module.exports = route;