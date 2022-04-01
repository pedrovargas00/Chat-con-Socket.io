const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async(socket, io) => {
   
   const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
   if (!usuario){
      console.log('Error en el controlador');
      return socket.disconnect();
   }
   //Agregar el usuario conectado
   chatMensajes.conectarUsuarios(usuario);
   io.emit('usuarios-activos', chatMensajes.usuariosArr);
   socket.emit('recibir-mensajes', chatMensajes.ultimos10);

   //Conectar a una sala especial
   socket.join(usuario.id);

   //Limpiar desconectados
   socket.on('disconnect', () => {
      chatMensajes.desconectarUsuario(usuario.id);
      io.emit('usuarios-activos', chatMensajes.usuariosArr);
   });

   socket.on('enviar-mensaje', ({uid, mensaje}) => {
      console.log(uid);
      console.log(mensaje);
      if (uid) {
         //Mensaje privado
         socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje});
      } else {
         console.log('Mensaje para todos');
         chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
         io.emit('recibir-mensajes', chatMensajes.ultimos10);
      }
   });
}

module.exports = {socketController};