const express = require('express');
const app = express();
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const bodyParser = require('body-parser');
const erroMiddleware = require('./middlewares/error')
const cookieParser = require('cookie-parser')

// data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser())

// Route impports
app.use('/api/v1',productRoutes)
app.use('/api/v1',userRoutes)

// Middleware for error
app.use(erroMiddleware);
 


module.exports = app;

 