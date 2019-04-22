const express = require('express');
const router = express.Router();

//Para crear rutas del servidor
router.get('/', (req, res) => {
  res.render('site/index');
});

//Para crear rutas del servidor
router.get('/test', (req, res) => {
  res.render('site/test');
});

module.exports = router;
