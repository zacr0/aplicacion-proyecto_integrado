var route = function (app) {
	//app.get('/perfil/:id', function(req, res) {
	app.get('/perfil', function(req, res) {
		res.render('perfil', {title: 'SocialGcap - Perfil'});
	});
}

module.exports = route;