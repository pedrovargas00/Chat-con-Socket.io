const Role = require('../models/role');
const Usuario = require('../models/usuario');

const roleValido = async(role = '') => {
   const existeRol = await Role.findOne({role});

   if (!existeRol)
      throw new Error(`El rol ${role} no es válido`);
}

const emailExiste = async(correo = '') => {
   const existeEmail = await Usuario.findOne({correo});
   if (existeEmail)
      throw new Error(`El correo ${correo} ya está registrado`);
}

const existeUsuarioPorID = async(id) => {

   const existeUsuario = await Usuario.findById(id);

   if(!existeUsuario)
      throw new Error(`El usuario con ID ${id} no existe`);

};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

   if (!colecciones.includes(coleccion))
      throw new Error(`La colección ${coleccion} no es permitida - ${colecciones}`);
   
   return true;
}

module.exports = {
   roleValido,
   emailExiste,
   existeUsuarioPorID,
   coleccionesPermitidas
};