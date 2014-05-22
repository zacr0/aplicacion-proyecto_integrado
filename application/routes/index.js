var Usuario = require('../models/Usuario'),
    async = require('async'), user;

var route = function (app) {
	app.get('/', function (req, res) {
		res.render('index');
	});

    // Login
	app.get('/login', function (req, res) {
        if (req.session.usuario) {
            res.render('perfil', {usuario: req.session.usuario});
        } else {
            res.render('login');
        };
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

                res.redirect('/perfil');
                /*res.send('nombre: ' + req.session.nombre +
                    '\napellidos: ' + req.session.apellidos +
                    '\nusuario: ' + req.session.usuario +
                    '\nperfil: ' + req.session.perfil +
                    '\nPromocion: ' + req.session.id_promocion +
                    '\nCurso: ' + req.session.id_curso
                );*/
            } else {
                console.log('El usuario no existe');
                res.render('login', {error: 'El usuario introducido no existe. ' +
                    'Compruebe que la información que ha introducido sea ' +
                    'correcta e inténtelo de nuevo.'});
            }
        });
    });

    // Registro
	app.get('/registro', function (req, res) {
		res.render('registro');
	});

	app.post('/registro', function (req, res) {
        var query = Usuario.find();
        var stream = query.stream();

        async.series([
            function (callback) {

                stream.on('data', function (data) {
                    if (data.usuario === req.body.usuario) {
                        return res.render('registro', 
                            {error: 'El nombre de usuario introducido ' +
                            'ya existe, introduzca otro.'});
                    }
                });
                
                stream.on('error', function (err) {
                    console.log(err);
                });

                stream.on('close', function () {
                    console.log('Ok');
                    callback();
                });

            }, function (callback) {
                console.log('despues de OK');

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
                    req.session.error = err;
                    console.log('Error al registrar usuario');
                    res.render('registro', {error: req.session.error});
                    return console.log(err);
                  }
                  console.log('Usuario registrado');
                  res.render('login', {success: true});

                }); // save

            } // function
        ]); // async.series
	});

    // Logout
    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect('/');
    });
}

module.exports = route;
