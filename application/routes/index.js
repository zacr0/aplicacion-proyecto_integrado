var Usuario = require('../models/Usuario'),
    async = require('async'),
    user;

var route = function (app) {
	app.get('/', function (req, res) {
		req.session.name = "Prueba";
		res.render('index', { title: 'SocialGcap - Inicio' });
	});

	app.get('/login', function (req, res) {
		res.render('login', {title: 'SocialGcap - Login', 
        name: req.session.name});
	});

  // Inicio de sesion aqui app.post('/login')...

	app.get('/registro', function (req, res) {
		res.render('registro', { title: 'SocialGcap - Registro'});
	});

	app.post('/registro', function (req, res) {
        var query = Usuario.find();
        var stream = query.stream();

        async.series([
            function (callback) {

                stream.on('data', function (data) {
                    if(data.usuario === req.body.usuario)
                      return res.render('registro', { error: 'Usuario ya existe'});
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
                    res.render('/registro', {title: 'SocialGcap - Registro', error: req.session.error});
                    delete res.session.error;
                    return console.log(err);
                  }
                  console.log('OK');
                }); // save

            } // function
        ]); // async.series
	});
}

module.exports = route;
