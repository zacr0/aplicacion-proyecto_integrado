var Usuario = require('../models/Usuario'),

route = function (app) {
	app.get('/perfil', function(req, res) {
		// Redirige a su perfil si el usuario solo escribe /perfil
		if (req.session.usuario) {
			res.redirect('/perfil/' + req.session.usuario);
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});

	app.get('/perfil/:usuario', function(req, res) {
		// Busca al usuario especificado en la url
		if (req.session.usuario) {
			Usuario.findOne({usuario: req.params.usuario}, function (err, user){
				if (err) {
                	console.log('Error al buscar usuario en la BD');
            	}
            	console.log('/perfil/usuario', user.usuario);
            	res.render('perfil', {datosUsuario: user, 
            		usuario: req.session.usuario});
			});
		} else {
			res.render('login', {error: 'Debes iniciar sesión ' +
				'para acceder a SocialGcap.'});
		}
	});
}

module.exports = route;