const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketController } = require('../sockets/controller');

class Server {

   constructor() {
      this.app = express();
      this.server = createServer(this.app);
      this.io = require('socket.io')(this.server);
      this.paths = {
         auth: '/api/auth',
         buscar: '/api/buscar',
         categorias: '/api/categorias',
         productos: '/api/productos',
         uploads: '/api/uploads',
         usuarios: '/api/usuarios'
      };
      //Conectar a base de datos
      this.conectarDB();
      //Midlewares
      this.middleware();
      //Rutas de la aplicación
      this.routes();
      //Sockets
      this.sockets();
   }

   async conectarDB() {
      await dbConnection();
   }

   middleware() {
      //CORS
      this.app.use(cors());
      //Lectura y parseo del body
      this.app.use(express.json());
      //Directorio público
      this.app.use(express.static('public'));
      //Carga de archivos
      this.app.use(fileUpload({
         useTempFiles : true,
         tempFileDir : '/tmp/',
         createParentPath: true
      }));
   }

   routes() {
      this.app.use(this.paths.auth, require('../routes/auth'));
      this.app.use(this.paths.buscar, require('../routes/buscar'));
      this.app.use(this.paths.categorias, require('../routes/categorias'));
      this.app.use(this.paths.productos, require('../routes/productos'));
      this.app.use(this.paths.uploads, require('../routes/uploads'));
      this.app.use(this.paths.usuarios, require('../routes/user'));
   }

   sockets() {
      this.io.on('connection', (socket) => socketController(socket, this.io));
   }

   listen() {
      this.server.listen(process.env.PORT);
   }
}

module.exports = Server;