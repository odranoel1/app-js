const bcrypt= require('bcryptjs');
const helpers = {};

//Este es un metodo
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); //Generamos un patron
  const hash = await bcrypt.hash(password, salt); //Pasamos contraseña y patron para el hash

  return hash;
};

//Comparar contraseña(texto plano), con la contraseña cifrada
helpers.matchPassword = async (password, savedPassword) => {
  try {
      return await bcrypt.compare(password, savedPassword);
  } catch(e) {
    console.log(e);
  }
};

module.exports = helpers;
