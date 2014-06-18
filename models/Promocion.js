var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Promocion = new Schema({
	nombre: {type: String, unique: true},
	alumnos: {type: Array}
});

exports = module.exports = mongoose.model('promociones', Promocion);