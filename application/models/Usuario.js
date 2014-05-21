var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Connection for database
mongoose.connect('mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado');

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
