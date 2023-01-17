const mongoose = require('mongoose');

//Conexión a la base de datos en MongoDB
//Utilizando el paquete mongoose
const dbConnection = async() => {

   try {
      await mongoose.connect(process.env.MONGODB_CNN, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log('Base de datos conectada');
   } catch (error) {
      console.log(error);
      throw new Error('Error al iniciar base de datos');
   }
}

module.exports = {dbConnection};