var Usuario = require('../models/Usuario'),

route = function (app) {
	app.get('/perfil', function(req, res) {
		
		if (req.session.usuario) {
			res.render('perfil', {usuario: req.session.usuario});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});

	app.get('/perfil/:usuario', function(req, res) {

		if (req.session.usuario) {
			Usuario.findOne({usuario: req.session.usuario}, function (err, user){
				if (err) {
                	console.log('Error al buscar usuario en la BD');
            	}
            	console.log('/perfil/usuario', user.usuario);
            	res.render('perfil', {datosUsuario: user, usuario: req.session.usuario});
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});
}

module.exports = route;