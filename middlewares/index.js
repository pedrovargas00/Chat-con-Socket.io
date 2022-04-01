const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarCategorias = require('../middlewares/validar-categorias');
const validarProductos = require('../middlewares/validar-productos');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
   ...validarCampos,
   ...validarJWT,
   ...validarRoles,
   ...validarCategorias,
   ...validarProductos,
   ...validarArchivo
};