var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Databaase connection
mongoose.connect('mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado');

var Asignatura = new Schema({
	nombre: {type: String, required: true, unique: true},
	id_curso: Schema.ObjectId,
});

exports = module.exports = mongoose.model('asignatura', Asignatura);