const express = require('express'); //Require sirve para traer un módulo de node.js
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('../common/config/keys');
const passport = require('passport');

//Initiliazations
const app = express(); //<--Express
require('./views/links/lib/passport');

//Settings (Configuraciones del servidor de express)
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views')); //<-- Establecer donde esta la carpeta views

app.engine('.hbs', exphbs({ //(exphbs es un objeto)
  defaultLayout: 'main', //Vista principal
  layoutsDir: path.join(app.get('views'), 'layouts'), //Indicar el directorio de la vista principal
  partialsDir: path.join(app.get('views'), 'site'), //Pequeñas partes de html que podemos usar en varias vistas
  extname: '.hbs',
  helpers: require('./views/links/lib/handlebars'),
}));
//Para utilizar el motor en nuestra app
app.set('view engine', '.hbs');


//Middlewares - Funciones ejecutadas al enviar una petición al servidor
app.use(session({
  secret: 'keysecret',
  resave: false,
  saveUnitialized: false,
  store: new MySQLStore(database)
}));

app.use(flash());

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());


// Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user; //Dato de session del usuario

  next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Public -- Static Files
app.use(express.static(path.join(__dirname, 'web/theme')));

//Server is listening
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
