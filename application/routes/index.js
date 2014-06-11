var Usuario = require('../models/Usuario'),
    Curso = require('../models/Curso'),
    Promocion = require('../models/Promocion'),
    Asignatura = require('../models/Asignatura'),
    Clave = require('../models/Clave'),
    async = require('async'),
    crypto = require('crypto'),
    user,
    cursoData,
    promocionData,
    asignaturaData,
    route = function (app) {
    	app.get('/', function (req, res) {
    		res.render('index');
    	});

        // Login
    	app.get('/login', function (req, res) {
            if (req.session.usuario != undefined) {
                res.redirect('perfil');
            } else {
                res.render('login');
            }
        }); // app.get/login

        app.post('/login', function (req, res) {
            Usuario.findOne({usuario: req.body.usuario, pass: req.body.pass},
             function (err, user) {
                var hash = crypto
                                .createHash('md5')
                                .update(req.body.pass)
                                .digest("hex");

                Usuario.findOne({usuario: req.body.usuario, pass: hash},
                 function (err, user) {
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
                            'correcta e inténtelo de nuevo.'
                        });
                    }
                });
            })
        }); // app.post/login

        // Registro
        var queryAsignaturas = Asignatura.find().sort( { "nombre": 1 } );

    	app.get('/registro', function (req, res) {
            async.series([
                function cursos(callback) {
                    Promocion.find(function (err, data){
                        promocionData = data;
                        Curso.find(function (err, data){
                            cursoData = data;
                            queryAsignaturas.exec(function (err, data){
                                asignaturaData = data;
                                callback();
                            });
                        });
                    });
                }, function resultados(callback) {
                    res.render('registro', {cursoData: cursoData, 
                        promocionData: promocionData,
                        asignaturaData: asignaturaData});
                }
            ]);
    	}); // app.get/registro

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
                                asignaturaData: asignaturaData,
                                cursoData: cursoData, 
                                promocionData: promocionData
                            });
                        }
                    });

                    stream.on('error', function (err) {
                        console.error(err);
                    });

                    stream.on('close', function () {
                        callback();
                    });

                }, function (callback) {
                    var hash = crypto
                                    .createHash('md5')
                                    .update(req.body.pass)
                                    .digest("hex");

                    user = new Usuario();
                    user.usuario = req.body.usuario;
                    user.pass = hash;
                    // Foto por defecto del usuario
                    user.foto = '/img/avatar_default.jpg';
                    user.nombre = req.body.nombre;
                    user.apellidos = req.body.apellidos;
                    user.email = req.body.email;
                    user.fechaNacimiento = req.body.fechanacimiento;
                    user.perfil = req.body.perfil;
                    user.social = [];

                    async.series([
                        function (callback){
                            if (req.body.perfil === 'profesor') {
                                user.asignaturasProfesor = req.body.asignatura;
                                callback();
                            } else{
                                Promocion.findOne({nombre: req.body.promocion}, function (err, data){
                                    user.id_promocion = data.id;
                                    Curso.findOne({nombre: req.body.curso}, function (err, data){
                                        user.id_curso = data.id;
                                        callback();
                                    }); // curso
                                }); // promocion
                            } // else
                        }, function (callback) {
                            if (req.body.perfil === 'profesor') {
                                Clave.findOne({nombre: 'claveProfesores', password: req.body.passProfesor}, function (err, pass) {
                                    if (err) {
                                        return console.error(err);
                                    } else {
                                        if (pass) {
                                            user.save(function (err) {
                                                if (err) {
                                                    req.session.error = err;
                                                    console.log('Error al registrar usuario');
                                                    res.render('registro', {error: req.session.error, 
                                                        cursoData: cursoData, 
                                                        promocionData: promocionData
                                                    });
                                                    return console.error(err);
                                                }
                                                console.log('Usuario registrado');
                                                res.render('login', {success: true});
                                            }); // save
                                        } else {
                                            return res.render('registro', 
                                                {error: 'La clave de profesor introducida ' +
                                                'no es válida, inténtelo de nuevo.', 
                                                cursoData: cursoData,
                                                asignaturaData: asignaturaData,
                                                promocionData: promocionData
                                            });
                                        }
                                    }
                                })
                            } else {
                                user.save(function (err) {
                                    if (err) {
                                        req.session.error = err;
                                        console.log('Error al registrar usuario');
                                        res.render('registro', {error: req.session.error, 
                                            cursoData: cursoData, 
                                            promocionData: promocionData
                                        });
                                        return console.error(err);
                                    }
                                    console.log('Usuario registrado');
                                    res.render('login', {success: true});
                                }); // save
                            }
                        }
                    ]); // async.series

                } // function
            ]); // async.series
        }); // app.post/registro

        // Logout
        app.get('/logout', function (req, res) {
            req.session.destroy();
            //req.session = null;
            res.redirect('/');
            console.log('Sesion borrada');
        }); // app.get/logout
    }

module.exports = route;
