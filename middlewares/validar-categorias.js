const { Categoria } = require("../models");

const existeCategoriaPorID = async(id) => {

   const existeCategoria = await Categoria.findById(id);

   if(!existeCategoria)
      throw new Error(`La categoría con ID ${id} no existe`);

};

module.exports = {existeCategoriaPorID}