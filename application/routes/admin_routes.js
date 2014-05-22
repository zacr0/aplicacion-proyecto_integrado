var route = function(app){
  require('./anuncios')(app);
  require('./index')(app);
  require('./perfil')(app);
  require('./salas')(app);
  require('./usuarios')(app);
}

module.exports = route;