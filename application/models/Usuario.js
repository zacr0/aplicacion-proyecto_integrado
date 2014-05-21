var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Connection for database
var connStr = 'mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado';

mongoose.connect(connStr, function(err){
  if (err) {
    console.log('Error al conectar a MongoDB');
    throw err;
  } else {
    console.log('Conectado a MongoDB');
  }
});

var Usuario = new Schema({
  nombre: {type: String, required: true},
  apellidos: {type: String, required: true},
  usuario: {type: String, required: true, trim: true, unique: true},
  pass: {type: String, required: true, trim: true},
  foto: String,
  fechaNacimiento: Date,
  email: {type: String, trim: true},
  perfil: String,
  id_promoción: Schema.ObjectId,
  id_curso: Schema.ObjectId
});

exports = module.exports = mongoose.model('usuario', Usuario);
