var Promocion = require('../models/Promocion'),
    Curso = require('../models/Curso'),
    Asignatura = require('../models/Asignatura'),
    Usuario = require('../models/Usuario'),
    async = require('async'),
    query,
    dataCursos = [],
    dataAsignaturas = [],
    dataPromociones = [],
    route = function (app) {
		app.get('/salas', function(req, res) {

			if (req.session.usuario != undefined) {
				async.series([
					function (callback) {
						query = Promocion.find({}, {_id: 0});   

					    query.exec(function (err, promociones) {
					        if (err) {
					            return console.log(err);
					        } else {
					            if (promociones.length > 0) {
					                dataPromociones = promociones;
					                callback();
					            } else {
					                console.log("No hay promociones");
					            } // else
					        } // else
					    }); // query
					}, function (callback) {
						query = Curso.find({},{_id: 0});

						query.exec(function (err, cursos) {
					        if (err) {
					            return console.log(err);
					        } else {
					            if (cursos.length > 0) {
									dataCursos = cursos;
									callback();
					            } else {
					                console.log("No hay cursos");
					            } // else
					        } // else
					    });
					}, function (callback) {
						query = Asignatura.find({}, {_id: 0, "id_curso": 0}).sort({"nombre": 1});

					    query.exec(function (err, asignaturas) {
					        if (err) {
					            return console.log(err);
					        } else {
					            if (asignaturas.length > 0) {
					                dataAsignaturas = asignaturas;
					                console.log('promocion: ' + JSON.stringify(dataPromociones));
									res.render('salas', {usuario: req.session.usuario,
										cursos: dataCursos,
										promociones: dataPromociones,
										asignaturas: dataAsignaturas
									});
					            } else {
					                console.log("No hay asignaturas");
					            } // else
					        } // else
					    });
					} // function
				]); // async
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}

		}); // app.get/salas
	}

module.exports = route;