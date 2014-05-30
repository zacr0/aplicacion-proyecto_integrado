var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    Promocion = require('../models/Promocion'),
    Curso = require('../models/Curso'),
    Asignatura = require('../models/Asignatura'),
    Usuario = require('../models/Usuario'),
    async = require('async'),
    route = function (app) {
		app.get('/salas', function(req, res) {

			if (req.session.usuario != undefined) {

				query = Usuario.findOne({nombre: req.session.usuario},{id_promocion: 0});

				async.series({
					promocion: function (callback) {
						query.exec(function (err, data) {
							Promocion.findOne({id: data.id_promocion}, function (err, PromocionData) {
								callback(null, PromocionData.nombre);
							});
						});
					},
					curso: function (callback) {
						query = Usuario.findOne({nombre: req.session.usuario},{id_promocion: 0});

						query.exec(function (err, data) {
							Curso.findOne({id: data.id_promocion}, function (err, CursoData) {
								curso = CursoData.nombre;
								callback(null, CursoData.nombre);
							});
						});
					},
					asignaturas: function (callback) {
						query = Curso.findOne({nombre: curso});

						query.exec(function (err, data) {
							console.log('_id: ' + data._id);
							Asignatura.find({id_curso: data._id}, {nombre: 1, _id: 0}, function (err, AsignaturasData) {
								//console.log('asignaturas: ' + AsignaturasData);
								callback(null, AsignaturasData);
							});
						});
					}
				}, function (err, results) {
						console.log('promocion: ' + JSON.stringify(results));
						res.render('salas', {usuario: req.session.usuario,
							curso: results.curso,
							promocion: results.promocion,
							asignaturas: results.asignaturas
						});
					});
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}

		});
	}

module.exports = route;