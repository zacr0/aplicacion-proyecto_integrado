var route = function(app){
  console.log('route admin routes');
  require('./index')(app);
  require('./usuarios')(app);
}

module.exports = route;