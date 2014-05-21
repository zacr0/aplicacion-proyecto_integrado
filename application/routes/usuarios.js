var route = function (app) {
	app.get('/usuarios', function(req, res) {
		res.render('usuarios');
	});
}

module.exports = route;
