var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://pablo:pablo@ds043388.mongolab.com:43388/proyectointegrado'),
    admin_routes = require('./routes/admin_routes'); // Module for routing

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('t999YE72wJ'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', cookie: {
    maxAge:  new Date(Date.now() + 3600000),
    expires: new Date(Date.now() + 3600000)
}}))

// Routing
admin_routes(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('No encontrado');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// set timezone
process.env.TZ = 'UTC+2';

app.listen(3000); // port to listen
console.log('Server running on localhost:3000');
console.log('Conectando a MongoDB...');

module.exports = app;