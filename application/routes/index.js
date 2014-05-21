var Usuario = require('../models/Usuario'), user;

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
            res.render('/registro', {title: 'SocialGcap - Registro', 
                error: req.session.error});
            delete res.session.error;
            return console.log(err);
          }
          console.log('usuario: ' + req.body.usuario +
            '\npass: ' + req.body.pass +
            '\nnombre: ' + req.body.nombre +
            '\napellidos: ' + req.body.apellidos +
            '\nfecha nacimiento: ' + req.body.fechaNacimiento +
            '\nperfil: ' + req.body.perfil);
          console.log('OK');
        });
	});
}

module.exports = route;
