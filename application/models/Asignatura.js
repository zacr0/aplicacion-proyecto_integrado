var mongoose = require('mongoose'), Schema = mongoose.Schema;

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