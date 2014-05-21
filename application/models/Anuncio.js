var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Database connection
var connStr = 'mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado';

mongoose.connect(connStr, function(err){
  if (err) {
    console.log('Error al conectar a MongoDB');
    throw err;
  } else {
    console.log('Conectado a MongoDB');
  }
});

var Anuncio = new Schema({
	id_usuario: Schema.ObjectId,
	titulo: {type: String, trim: true, required: true},
	contenido: {type: String, required: true},
	fechaPublicacion: Date,
	fechaEdicion: Date
});

exports = module.exports = mongoose.model('anuncio', Anuncio);