var route = function (app) {
	/* NO definitivo */
	//app.get('/salas/:id', function(req, res) {
	app.get('/salas', function(req, res) {
		//res.send('salas');
		res.render('salas');
	});
}

module.exports = route;