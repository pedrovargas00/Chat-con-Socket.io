const {Router} = require('express');
const {check} = require('express-validator');
const {
   cargarArchivo,
   obtenerArchivo,
   actualizarArchivoCloudinary} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const {validarCampos, validarArchivo} = require('../middlewares');

const router = Router();

router.get('/:coleccion/:id',[
   check('id', 'El id debe de ser de MongoDB').isMongoId(),
   check('coleccion').custom(c => coleccionesPermitidas (c, ['usuarios', 'productos'])),
   validarCampos
], obtenerArchivo)
router.post('/', validarArchivo, cargarArchivo);
router.put('/:coleccion/:id', [
   validarArchivo,
   check('id', 'El id debe de ser de MongoDB').isMongoId(),
   check('coleccion').custom(c => coleccionesPermitidas (c, ['usuarios', 'productos'])),
   validarCampos
], actualizarArchivoCloudinary);
//actualizarArchivo);

module.exports = router;