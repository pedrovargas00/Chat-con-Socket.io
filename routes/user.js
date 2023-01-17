const {Router} = require('express');
const {check} = require('express-validator');
const {usuariosGet,
   usuariosPost, 
   usuariosPut,
   usuariosPatch,
   usuariosDelete} = require('../controllers/usuarios');
const {roleValido,
   emailExiste,
   existeUsuarioPorID} = require('../helpers/db-validators');
const {
   validarCampos,
   validarJWT,
   validarRol} = require('../middlewares');
//const {validarCampos} = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { validarAdmin, validarRol } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', usuariosGet);
router.post('/',
   [check('nombre', 'El nombre es obligatorio').notEmpty(),
   check('password', 'El password debe ser más de 6 letras').isLength(6),
   //check('correo', 'El correo no es válido').isEmail()],
   check('correo').custom(emailExiste),
   //check('rol').custom(rol => roleValido(rol)), lo de abajo es igual.
   check('rol').custom(roleValido),
   validarCampos],
   usuariosPost);
router.put('/:id', [
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeUsuarioPorID),
   check('rol').custom(roleValido),
   validarCampos
], usuariosPut);
router.delete('/:id', [
   validarJWT,
   //validarAdmin,
   validarRol('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
   check('id', 'No es un ID válido').isMongoId(),
   check('id').custom(existeUsuarioPorID),
    validarCampos
], usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;