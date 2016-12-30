var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql')

var expense = require('./routes/expense');

var app = express();

var config = require('./config');

//Create DB connection
var connection = mysql.createConnection({
  host: config.mysqlDB.hostName,
  user: config.mysqlDB.username,
  password: config.mysqlDB.password,
  database: config.mysqlDB.database
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})

app.locals.connection = connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/expense', expense);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
