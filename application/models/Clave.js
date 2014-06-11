var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Clave = new Schema({
	nombre: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

exports = module.exports = mongoose.model('clave', Clave);