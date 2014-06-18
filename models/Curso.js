var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Curso = new Schema({
	nombre: {type: String, unique: true}
});

exports = module.exports = mongoose.model('cursos', Curso);