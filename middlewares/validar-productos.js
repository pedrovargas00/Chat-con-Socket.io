const { Producto } = require("../models");

const existeProductoPorID = async(id) => {

   const existeProducto = await Producto.findById(id);

   if(!existeProducto)
      throw new Error(`El producto con ID ${id} no existe`);

};

module.exports = {existeProductoPorID}