var route = function (app) {
	app.get('/usuarios', function(req, res) {
		res.send('respond with a resource');
	});
}

module.exports = route;
