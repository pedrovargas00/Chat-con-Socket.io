const {Router} = require('express');
const {check} = require('express-validator');
const {
   crearCategoria,
   obtenerCategorias,
   obtenerCategoria,
   actualizarCategoria,
   borrarCategoria} = require('../controllers/categorias');
const {
   validarJWT,
   existeCategoriaPorID,
   validarCampos,
   validarAdmin} = require('../middlewares');

const router = Router();
// {{url}}/api/categorias

//Obtener todas las categorias - público
router.get('/', obtenerCategorias);
//Obtener una categoria por id - público
router.get('/:id', [
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeCategoriaPorID),
   validarCampos
], obtenerCategoria);
//Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
   ], crearCategoria);
//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
   validarJWT,
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeCategoriaPorID),
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
], actualizarCategoria);
//Borrar una categoría - Admin
router.delete('/:id', [
   validarJWT,
   validarAdmin,
   //validarRol('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeCategoriaPorID),
   validarCampos
], borrarCategoria);

module.exports = router;