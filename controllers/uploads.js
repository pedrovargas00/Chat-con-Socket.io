const path = require("path");
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const {Usuario, Producto} = require("../models");

cloudinary.config(process.env.CLOUDINARY_URL);

const obtenerArchivo = async(req = request, res = response) => {

   const {id, coleccion} = req.params;
   let modelo;

   switch (coleccion) {
      case 'usuarios':
         modelo = await Usuario.findById(id);
         if (!modelo)
            return res.status(400).json({msg: `No existe el usuario con id ${id}`})
         break;
      case 'productos':
         modelo = await Producto.findById(id);
         if (!modelo)
            return res.status(400).json({msg: `No existe el producto con id ${id}`})
         break;
      default:
         return res.status(500).json({msg: 'Función no realizada'});
   }
   //Limpar imágenes previas
   if (modelo.img) {
      //Borrar la imagen del servidor
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
      if (fs.existsSync(pathImagen))
         return res.sendFile(pathImagen)
   }
   const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');
   res.sendFile(pathNoImagen);
}

const cargarArchivo = async(req = request, res = response) => {
   //txt, md
   try {
      //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
      const nombre = await subirArchivo(req.files, undefined, 'img');
      res.json({nombre});
   } catch (msg) {
      res.status(400).json({msg});
   }
}

/*const actualizarArchivo = async(req = request, res = response) => {

   const {id, coleccion} = req.params;
   let modelo;

   switch (coleccion) {
      case 'usuarios':
         modelo = await Usuario.findById(id);
         if (!modelo)
            return res.status(400).json({msg: `No existe el usuario con id ${id}`})
         break;
      case 'productos':
         modelo = await Producto.findById(id);
         if (!modelo)
            return res.status(400).json({msg: `No existe el producto con id ${id}`})
         break;
      default:
         return res.status(500).json({msg: 'Función no realizada'});
   }
   //Limpar imágenes previas
   if (modelo.img) {
      //Borrar la imagen del servidor
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
      if (fs.existsSync(pathImagen))
         fs.unlinkSync(pathImagen);
   }
   const nombre = await subirArchivo(req.files, undefined, coleccion);
   modelo.img = nombre;
   await modelo.save();
   res.json(modelo);
}*/

const actualizarArchivoCloudinary = async(req = request, res = response) => {

   const {id, coleccion} = req.params;
   let modelo;

   switch (coleccion) {
      case 'usuarios':
         modelo = await Usuario.findById(id);
         if (!modelo)
            return res.status(400).json({msg: `No existe el usuario con id ${id}`})
         break;
      case 'productos':
         modelo = await Producto.findById(id);
         if (!modelo)
            return res.status(400).json({msg: `No existe el producto con id ${id}`})
         break;
      default:
         return res.status(500).json({msg: 'Función no realizada'});
   }
   //Limpar imágenes previas
   if (modelo.img) {
      //Borrar la imagen de cloudinary
      const nombre = modelo.img.split('/').pathImagen[pathImagen.lenght - 1];
      const [public_id] = nombre.split('.');
      cloudinary.uploader.destroy(public_id);
   }
   const {secure_url} = await cloudinary.uploader.upload(req.files.archivo.tempFilePath);
   modelo.img = secure_url;
   await modelo.save();
   res.json(modelo);
}

module.exports = {
   cargarArchivo,
   actualizarArchivoCloudinary,
   obtenerArchivo
};