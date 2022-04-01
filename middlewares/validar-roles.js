const { request, response } = require("express");


const validarAdmin = (req = request, res = response, next) => {

   if (!req.usuario)
      return res.status(500).json({msg: 'Se quiere verificar el role sin validar el token'});
   const {rol, nombre} = req.usuario;

   if (rol !== 'ADMIN_ROLE')
      return res.status(401).json({msg: 'No es administrador'});
   next();
}

const validarRol = (...roles) => {
   return (req = request, res = response, next) => {
      if (!req.usuario)
         return res.status(500).json({msg: 'Se quiere verificar el role sin validar el token'});
      if (!roles.includes(req.usuario.rol))
         return res.status(401).json({msg: `El servicio requiere uno de estos roles ${roles}`});
      next();
   }
}

module.exports = {
   validarAdmin,
   validarRol
};