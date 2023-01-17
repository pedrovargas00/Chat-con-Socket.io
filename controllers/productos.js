const { request, response } = require("express");
const {Producto} = require('../models');

//Paginado-total-populate
const obtenerProductos = async(req = request, res = response) => {

   const {limite = 5, desde = 0} = req.query;
   const query = {estado: true};

   const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
      .populate('usuario', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite))
   ]);

   res.json({
      total,
      productos
   });
}
//populate
const obtenerProducto = async(req = request, res = response) => {

   const {id} = req.params;
   const producto = await Producto.findById(id).populate('usuario', 'nombre');

   res.json({
      producto,
   });
}

const actualizarProducto = async(req = request, res = response) => {

   const {id} = req.params;
   const {estado, usuario, ...data} = req.body;

   //Aquí se actualiza
   data.nombre = data.nombre.toUpperCase();
   data.usuario = req.usuario._id;

   const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

   res.json({
      producto
   });
}

const borrarProducto = async(req = request, res = response) => {
   const {id} = req.params;
   const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

   res.json({
      producto
   });
}

const crearProducto = async(req = request, res = response) => {

   const {estado, usuario, ...body} = req.body;
   const nombre = req.body.nombre.toUpperCase();
   const productoDB = await Producto.findOne({nombre});

   if(productoDB)
      return res.status(400).json({
         msg: `La producto ${productoDB.nombre} ya existe`
      });
      //Generar la data a guardar
      const data = {
         nombre: req.body.nombre.toUpperCase(),
         usuario: req.usuario._id,
         ...body
      };
      //Almacena en base de datos
      const producto = new Producto(data);
      await producto.save();
      res.status(201).json(producto)
}

module.exports = {
   crearProducto,
   obtenerProductos,
   obtenerProducto,
   actualizarProducto,
   borrarProducto
};