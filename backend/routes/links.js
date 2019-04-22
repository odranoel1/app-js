const express = require('express');
const router = express.Router();

const pool = require('../../common/config/db');

const { isLoggedIn } = require('../views/links/lib/verifyLogin'); //Nos importamos el método

//Para crear rutas del servidor
router.get('/create', isLoggedIn, (req, res) => {
  res.render('links/create');
});

router.post('/create', isLoggedIn, async (req, res) => {
  // console.log(req.body); <-- Show data in console
  const { title, url, description } = req.body;
  const newLink  = {
    title,
    url,
    description,
    user_id: req.user.id //Toma el id de la session del usuario y almacearlo con esa tarea
  };
  // console.log(newLink);
  //Guardar en la base de datos
  //Await <--Va tomar un tiempo de ejecucion, cuando termine, corre con lo que este debajo
  await pool.query('INSERT INTO links set ?', [newLink]); //Enlazar links con un usuario (por id)
  req.flash('success', 'Link saved succesfully');
  res.redirect('/links');
});

//Para mostrar los datos que estan guardados en la db
router.get('/',isLoggedIn, async (req, res) => {
  const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]); //Consultar solo los links de ese usuario
  console.log(links);
  res.render('links/index', {links});
});

//Eliminar los datos que estan guardados en la db
router.get('/delete/:id',isLoggedIn, async (req, res) => {
  // console.log(req.params.id); Comprobar el link que se esta enviando
  // res.send('Deleted');
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE id = ?', [id]);
  req.flash('success', 'Link removed succesfully');
  res.redirect('/links');
});

//Actualizar los datos que estan guardados en la db
router.get('/update/:id',isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  res.render('links/update', {link: links[0]});
});

router.post('/update/:id',isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;
  const newLink  = {
    title,
    url,
    description
  };
  await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
  req.flash('success', 'Link Updated succesfully');
  res.redirect('/links');
});

module.exports = router;
