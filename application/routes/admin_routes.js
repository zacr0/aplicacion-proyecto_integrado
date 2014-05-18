var route = function(app){
  console.log('route admin routes');
  require('./anuncios')(app);
  require('./index')(app);
  require('./perfil')(app);
  require('./salas')(app);
  require('./usuarios')(app);
}

module.exports = route;