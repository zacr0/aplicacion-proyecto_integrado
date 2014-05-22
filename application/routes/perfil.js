/* VARIABLES DE SESION ACUERDATEEEEEEEEEEEEEEEEEEEEEEE */
var route = function (app) {
<<<<<<< HEAD
	app.get('/perfil', function(req, res) {
		
		if (req.session.usuario) {
			res.render('perfil', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
=======
	//app.get('/perfil/:id', function(req, res) {
	app.get('/perfil/:usuario', function(req, res) {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>' + req.usuario);
		//res.render('perfil', {title: 'SocialGcap - Perfil'});
		res.send(req.usuario);
>>>>>>> controllers
	});
}

module.exports = route;