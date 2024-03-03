const express = require('express');
const routesUser = require('../routes/users.routes');
const cors = require('cors');
const logger = require('morgan');

const app = express();

app.use(express.json());
app.use(cors())
app.use(logger("dev"));

app.use(routesUser);

module.exports = app;