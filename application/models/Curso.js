var mongoose = require('mongoose'), Schema = mongoose.Schema;

// Database connection
mongoose.connect('mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado');

var Curso = new Schema({
	nombre: {type; String, unique: true}
});

exports = module.exports = mongoose.model('curso', Curso);