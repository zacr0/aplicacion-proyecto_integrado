var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Connection for database
mongoose.connect('mongodb://user:pass@server');

var Usuario = new Schema({
  nombre: String,
  apellidos: String,
  usuario: String,
  pass: String,
  foto: String,
  fechaNacimiento: Date,
  email: String,
  perfil: String,
  id_promoción: Schema.ObjectId,
  id_curso: Schema.ObjectId
});

exports = module.exports = mongoose.model('usuario', Usuario);
