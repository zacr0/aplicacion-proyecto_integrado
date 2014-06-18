var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Anuncio = new Schema({
  	autor: {type: {}},
	titulo: {type: String, trim: true, required: true},
	contenido: {type: String, required: true},
	fechaPublicacion: { type: Date, default: Date.now },
	fechaEdicion: Date
});

exports = module.exports = mongoose.model('anuncio', Anuncio);