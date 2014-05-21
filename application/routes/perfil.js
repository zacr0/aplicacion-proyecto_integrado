/* VARIABLES DE SESION ACUERDATEEEEEEEEEEEEEEEEEEEEEEE */
var route = function (app) {
	//app.get('/perfil/:id', function(req, res) {
	app.get('/perfil/:usuario', function(req, res) {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>' + req.usuario);
		//res.render('perfil', {title: 'SocialGcap - Perfil'});
		res.send(req.usuario);
	});
}

module.exports = route;