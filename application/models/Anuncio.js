var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Database connection
mongoose.connect('mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado');

var Anuncio = new Schema({
	id_usuario: Schema.ObjectId,
	titulo: {type: String, required: true},
	contenido: {type: String, required: true},
	fechaPublicacion: Date,
	fechaEdicion: Date
});

exports = module.exports = mongoose.model('anuncio', Anuncio);