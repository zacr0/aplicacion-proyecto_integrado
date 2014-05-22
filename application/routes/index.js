var Usuario = require('../models/Usuario'),
    Curso = require('../models/Curso'),
    Promocion = require('../models/Promocion'),
    async = require('async'),
    user,
    cursoData,
    promocionData;

var route = function (app) {
	app.get('/', function (req, res) {
		res.render('index');
	});

    // Login
	app.get('/login', function (req, res) {
		res.render('login');
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

                console.log('nombre: ' + req.session.nombre +
                    '\napellidos: ' + req.session.apellidos +
                    '\nusuario: ' + req.session.usuario +
                    '\nperfil: ' + req.session.perfil +
                    '\nPromocion: ' + req.session.id_promocion +
                    '\nCurso: ' + req.session.id_curso
                );
                res.render('perfil');
            } else {
                console.log('El usuario no existe');
                res.render('login', {error: 'El usuario introducido no existe. ' +
                    'Compruebe la información que ha introducido e ' +
                    'inténtelo de nuevo.'});
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
                });
            }, function resultados(callback) {
                res.render('registro', {cursoData: cursoData, promocionData: promocionData});
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
                            {error: 'Usuario ya existe', cursoData: cursoData, promocionData: promocionData});
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
                    console.log('cursoData: ', cursoData);
                    console.log('promocionData: ', promocionData);
                    console.log('Error al registrar usuario');
                    res.render('registro', {error: req.session.error, cursoData: cursoData, promocionData: promocionData});
                    delete res.session.error;
                    return console.log(err);
                  }
                  console.log('Usuario registrado');
                  res.render('login', {success: true});

                }); // save

            } // function
        ]); // async.series
	});
}

module.exports = route;
