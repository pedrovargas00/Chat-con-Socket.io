const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

const login = async(req, res) => {

   const  {correo, password} = req.body;

   try {
      //Verificar si el email existe
      const usuario = await Usuario.findOne({correo});
      if(!usuario)
         return res.status(400).json({msg: 'Usuario/Password no son correctos'});
      //Verificar si el usuario está activo
      if(!usuario.estado)
         return res.status(400).json({msg: 'El usuario no está activo'});
      //Verificar la contraseña
      const validarPassword = bcryptjs.compareSync(password, usuario.password);
      if(!validarPassword)
         return res.status(400).json({msg: 'La contraseña es incorrecta'});
      //Generar el JWT
      const token = await generarJWT(usuario.id);
      res.json({
         msg: 'Login ok',
         usuario,
         token
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({msg: 'Hable con el administrador'});
   }
}

const googleSignIn = async(req, res = response) => {

   const {id_token} = req.body;

   try {
      const {nombre, img, correo} = await googleVerify(id_token);
      let usuario = await Usuario.findOne({correo});

      //Crear usuario
      if (!usuario){
         const data = {
            nombre,
            correo,
            password: ':P',
            img,
            google: true
         };
         usuario = new Usuario(data);
         await usuario.save();
      }
      //Validar si estado = false
      if (!usuario.estado)
         return res.status(401).json({msg: 'Usuario bloqueado'});
      //Generar JWT
      const token = await generarJWT(usuario.id);
      res.json({
         usuario,
         token
      });
   } catch (error) {
      console.log(error);
      res.status(400).json({
         ok: false,
         msg: 'El token no se pudo verificar'
      });
   }
}

const renovarToken = async(req, res = response) => {

   const {usuario} = req;
   const token = await generarJWT(usuario.id);
   res.json({
      usuario,
      token
   });
}

module.exports = {
   login,
   googleSignIn,
   renovarToken
};