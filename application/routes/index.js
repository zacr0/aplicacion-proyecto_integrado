var Usuario = require('../models/Usuario'),
    Curso = require('../models/Curso'),
    Promocion = require('../models/Promocion'),
    async = require('async'),
    user,
    cursoData,
    promocionData,
    asignaturaData;

var route = function (app) {
	app.get('/', function (req, res) {
		res.render('index');
	});

    // Login
	app.get('/login', function (req, res) {
        if (req.session.usuario) {
            res.redirect('perfil');
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

                res.redirect('/perfil/' + req.session.usuario);
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
        async.series([
            function cursos(callback) {
                Promocion.find(function (err, data){
                    promocionData = data;
                    Curso.find(function (err, data){
                        cursoData = data;
                        callback();
                    });
                    // Consulta de asigunaturas
                });
            }, function resultados(callback) {
                res.render('registro', {cursoData: cursoData, 
                    promocionData: promocionData});
            }
        ]);
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
                            'ya existe, introduzca otro.', 
                            cursoData: cursoData, 
                            promocionData: promocionData});
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
                    res.render('registro', {error: req.session.error, 
                        cursoData: cursoData, 
                        promocionData: promocionData});
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
