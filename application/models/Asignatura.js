var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Databaase connection
var connStr = 'mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado';

mongoose.connect(connStr, function(err){
  if (err) {
    console.log('Error al conectar a MongoDB');
    throw err;
  } else {
    console.log('Conectado a MongoDB');
  }
});

var Asignatura = new Schema({
	nombre: {type: String, required: true, unique: true},
	id_curso: Schema.ObjectId,
});

exports = module.exports = mongoose.model('asignatura', Asignatura);