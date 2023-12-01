const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const { default: helmet } = require('helmet');
const bodyParser = require('body-parser');

const { checkOverload } = require('./helpers/check.connect');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// init db
require('./dbs/init.mongodb');
// checkOverload();

// init router
app.use('', require('./routers'));

// handing error

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = '400';
  next(err);
});

app.use((err, req, res) => {
  const status = err.status || '500';
  return res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
