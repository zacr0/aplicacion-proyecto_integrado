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

var Curso = new Schema({
	nombre: {type; String, unique: true}
});

exports = module.exports = mongoose.model('curso', Curso);