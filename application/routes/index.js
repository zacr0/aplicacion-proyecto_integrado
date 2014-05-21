var Usuario = require('../models/Usuario'), user;

var route = function (app) {
	app.get('/', function (req, res) {
		res.render('index', { title: 'SocialGcap - Inicio' });
	});

    // Login
	app.get('/login', function (req, res) {
		res.render('login', {title: 'SocialGcap - Login'});
	});

    app.post('/login', function(req, res) {
        Usuario.findOne({usuario: req.body.usuario, pass: req.body.pass},
         function(err, user) {
            if (err) {
                console.log('Error al buscar usuario en la BD');
            }

            if (user) {
                req.session.nombre = user.nombre;
                req.session.apellidos = user.apellidos;
                req.session.usuario = user.usuario;
                req.session.perfil = user.perfil;
                req.session.id_promocion = user.id_promocion;
                req.session.id_curso = user.id_curso;

                res.send('nombre: ' + req.session.nombre +
                    '\napellidos: ' + req.session.apellidos +
                    '\nusuario: ' + req.session.usuario +
                    '\nperfil: ' + req.session.perfil +
                    '\nPromocion: ' + req.session.id_promocion +
                    '\nCurso: ' + req.session.id_curso
                );
            } else {
                console.log('El usuario no existe');
                res.render('login', {title: 'SocialGcap - Inicio',
                    error: 'El usuario introducido no existe. ' +
                    'Compruebe la información que ha introducido e ' +
                    'inténtelo de nuevo.'});
            }
        });
    });

    // Registro
	app.get('/registro', function (req, res) {
		res.render('registro', { title: 'SocialGcap - Registro'});
	});

	app.post('/registro', function (req, res) {
        user = new Usuario();
        user.usuario = req.body.usuario;
        user.pass = req.body.pass;
        user.nombre = req.body.nombre;
        user.apellidos = req.body.apellidos;
        user.email = req.body.email;
        user.fechaNacimiento = req.body.fechanacimiento;
        user.perfil = req.body.perfil;
        user.save(function (err) {
          if (err) {
            console.log('Error al registrar usuario');
            res.render('registro', {title: 'SocialGcap - Registro', 
                error: req.session.error});
            delete res.session.error;
            return console.log(err);
          }
          console.log('OK');
        });

        res.send('usuario: ' + req.body.usuario +
        	'\npass: ' + req.body.pass +
        	'\nnombre: ' + req.body.nombre +
        	'\napellidos: ' + req.body.apellidos +
            '\nemail: ' + req.body.email +
        	'\nfecha nacimiento: ' + req.body.fechanacimiento +
        	'\nperfil: ' + req.body.perfil
        );
	});
}

module.exports = route;
