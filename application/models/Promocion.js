var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Promocion = new Schema({
	nombre: {type: String, unique: true}
});

exports = module.exports = mongoose.model('promociones', Promocion);