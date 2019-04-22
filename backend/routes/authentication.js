const express = require('express');
const router = express.Router();

const passport = require('passport');

const { isLoggedIn } = require('../views/links/lib/verifyLogin'); //Nos importamos el método
const { isNotLoggedIn } = require('../views/links/lib/verifyLogin');

//Renderizar el formulario
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('site/login');
});
router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('site/register');
});

//Recibir los datos del formulario
router.post('/register', isNotLoggedIn, passport.authenticate('local.register', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}))

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res ) => {
  res.render('site/profile');
});

router.get('/logout', isLoggedIn, (req, res ) => {
  //Termina la sesion del usuario (la limpia) con passport
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
