var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Asignatura = new Schema({
	nombre: {type: String, required: true, unique: true},
	id_curso: Schema.ObjectId,
});

exports = module.exports = mongoose.model('asignatura', Asignatura);