var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
var cors = require('cors');

//var indexRouter = require("./routes/index");
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var locationsRouter = require('./routes/locations');
var authRouter = require('./routes/auth');

var app = express();
app.use(cors());

mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb+srv://tiago340:pawm1@cluster0.b4xu3.mongodb.net/PAW?retryWrites=true&w=majority',
    { useNewUrlParser: true },
  )
  .then(() => console.log('Conexão bem sucedida.'))
  .catch((err) => console.error(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/*app.use("/", indexRouter);*/
app.use('/users', usersRouter);
app.use('/', eventsRouter);
app.use('/', locationsRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.jade');
});

module.exports = app;
