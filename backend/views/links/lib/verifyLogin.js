module.exports = {
  isLoggedIn(req, res, next) { //Este es un método (Se ocupan los objetos, req, res, next)
    //Por cada ruta vamos a procesar estos datos
    /*
      req es para recibir los datos del usuario
      passport cuando se inicializo en index.js está poblando a req de nuevos metodos
    */
    if(req.isAuthenticated()) { //Validar si existe la session del usuario
        return next();
    } else {
      return res.redirect('/login');
    }
  },

  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/profile');
    }
  }
};
