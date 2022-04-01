const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req, res) => {
   /*Obtiene las variables y los datos de la petición que
   se encuentran en la url de la aplicación, ejem:
   http://localhost:8080/api/usuarios?q=hola&nombre=pedro...*/
   //const {q, nombre = 'No name', apikey} = req.query;
   const {limite = 5, desde = 0} = req.query;
   const query = {estado: true};
   //const usuarios = await Usuario.find(query)
   //   .skip(Number(desde))
   //   .limit(Number(limite));
   //const total = await Usuario.countDocuments(query);
   //Desestructuración de arreglos
   const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
   ]);

   res.json({
      //msg: 'get API - controlador',
      total,
      usuarios
   });
}

const usuariosPost = async (req, res) => {

   //Recibe el contenido de la petición
   const {nombre, correo, password, rol} = req.body;
   const usuario = new Usuario({nombre, correo, password, rol});

   //Verificar el correo
   //Encriptar la contraseña
   const salt = bcryptjs.genSaltSync();
   usuario.password = bcryptjs.hashSync(password, salt);
   //Guardar en BD
   await usuario.save();
   res.json({
      msg: 'post API - controlador',
      usuario
   });
}

const usuariosPut = async(req, res) => {

   const id = req.params.id;
   const {_id, password, google, correo, ...resto} = req.body;

   //Validar usuario en base de datos
   if(password){
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
   }
   //Aquí se actualiza
   const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

   res.json({
      msg: 'put API - controlador',
      usuario
   });
}

const usuariosPatch = (req, res) => {
   res.json({
      msg: 'patch API - controlador'
   });
}

const usuariosDelete = async(req, res) => {

   const {id} = req.params;
   const uid = req.uid;
   //Borrado físico
   //const usuario = await Usuario.findByIdAndDelete(id);
   //Borrado virtual
   const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});
   //const usuarioAutenticado = req.usuario;
   res.json({
      msg: 'delete API - controlador',
      usuario,
      uid,
      //usuarioAutenticado
   });
}

module.exports = {
   usuariosGet,
   usuariosPost,
   usuariosPut,
   usuariosPatch,
   usuariosDelete
};