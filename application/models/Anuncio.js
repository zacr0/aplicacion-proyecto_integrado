var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Anuncio = new Schema({
	id_usuario: Schema.ObjectId,
	titulo: {type: String, trim: true, required: true},
	contenido: {type: String, required: true},
	fechaPublicacion: Date,
	fechaEdicion: Date
});

exports = module.exports = mongoose.model('anuncio', Anuncio);