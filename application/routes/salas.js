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
				res.render('salas', {usuario: req.session.usuario
							});
				/*if (req.session.perfil == 'alumno') {
					// Esto solo se cumple si el usuario es alumno, de
					// lo contrario, peta
					// Tenemos almacenado el el curso del usuario
					// y su promocion en una variable de sesion
					// no hace falta tanta consulta

					// PENDIENTE DE CAMBIAR
					query = Usuario.findOne({'usuario': req.session.usuario},
											{'id_promocion': 1});

					async.series({
						promocion: function (callback) {
							query.exec(function (err, data) {
								if (err) {
									console.log(err);
								} else {
									Promocion.findOne({_id: data.id_promocion}, function (err, PromocionData) {
										callback(null, PromocionData.nombre);
									});
								}
							});
						},
						curso: function (callback) {
							query = Usuario.findOne({'usuario': req.session.usuario},
													{'id_curso': 1});

							query.exec(function (err, data) {
								if (err) {
									return console.log(err);
								} else {
									Curso.findOne({_id: data.id_curso}, function (err, CursoData) {
										curso = CursoData.nombre;
										callback(null, CursoData.nombre);
									});
								}
							});
						},
						asignaturas: function (callback) {
							query = Curso.findOne({'nombre': curso});

							query.exec(function (err, data) {
								if (err) {
									console.log(err);
								} else {
									console.log('_id: ' + data._id);
									Asignatura.find({'id_curso': data._id}, {'nombre': 1, _id: 0}, function (err, AsignaturasData) {
										//console.log('asignaturas: ' + AsignaturasData);
										callback(null, AsignaturasData);
									});
								}
							});
						}
					}, function (err, results) {
						if (err) {
							console.log(err);
						} else {
							console.log('promocion: ' + JSON.stringify(results));
							res.render('salas', {usuario: req.session.usuario,
								curso: results.curso,
								promocion: results.promocion,
								asignaturas: results.asignaturas
							});
						}
					});	
					
				} else {
					// Si el usuario es profesor
					
					// PENDIENTE DE ACABAR
				}*/
			} else {
				res.render('login', {error: 'Debes iniciar sesión ' +
					'para acceder a SocialGCap.'});
			}

		});
	}

module.exports = route;