const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../../../../common/config/db');
const helpers =  require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => { //Este es una funcion

  console.log(req.body);

  const rows = await pool.query('SELECT * FROM users WHERE username = ? ', [username]); //Trae a todos los usuarios
  if(rows.length > 0) { //Si la longitud de la fila es mayor a 0 es que lo encontró
    const user = rows[0]; //Guardamos el usuario
    const validPassword = await helpers.matchPassword(password, user.password);
    if (validPassword) {
      done(null, user, req.flash('success','Welcome ' + user.username));
    } else {
      done(null, false, req.flash('message','Incorrect password'));
    }
  } else {
    return done(null, false, req.flash('message','The username does not exists'));
  }
}));

passport.use('local.register', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //Para guardar algun dato
}, async (req, username, password, done)=> { //--> Que va pasar al autenticar al usuario

  const { fullname } = req.body;

  //Crear un usuario
  const newUser = {
    username,
    password,
    fullname
  };

  newUser.password = await helpers.encryptPassword(password);

  const result = await pool.query('INSERT INTO users SET ?', [newUser]);
  // console.log(result); <-- Checar que tdo se envio correctamente
  newUser.id = result.insertId; // <-- Pasar el id
  return done(null, newUser);
}));

passport.serializeUser((user,done) => {
  done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});
