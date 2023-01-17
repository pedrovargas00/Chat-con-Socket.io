const {Router} = require('express');
const {check} = require('express-validator');
const {
   crearProducto,
   obtenerProductos,
   obtenerProducto,
   actualizarProducto,
   borrarProducto} = require('../controllers/productos');
const {
   validarJWT,
   validarCampos,
   validarAdmin,
   existeProductoPorID} = require('../middlewares');

const router = Router();
// {{url}}/api/productos

//Obtener todas los productos - público
router.get('/', obtenerProductos);
//Obtener un producto por id - público
router.get('/:id', [
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeProductoPorID),
   validarCampos
], obtenerProducto);
//Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   check('categoria', 'La categoría es obligatoria').not().isEmpty(),
   validarCampos
   ], crearProducto);
//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
   validarJWT,
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeProductoPorID),
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
], actualizarProducto);
//Borrar una categoría - Admin
router.delete('/:id', [
   validarJWT,
   validarAdmin,
   //validarRol('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeProductoPorID),
   validarCampos
], borrarProducto);

module.exports = router;