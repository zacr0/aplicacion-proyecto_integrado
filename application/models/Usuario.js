var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Usuario = new Schema({
  nombre: {type: String, required: true},
  apellidos: {type: String, required: true},
  usuario: {type: String, required: true, trim: true, unique: true},
  pass: {type: String, required: true, trim: true},
  foto: String,
  fechaNacimiento: Date,
  email: {type: String, trim: true},
  perfil: String,
  id_promocion: Schema.ObjectId,
  id_curso: Schema.ObjectId,
  asignaturasProfesor: [String]
});

exports = module.exports = mongoose.model('usuario', Usuario);
