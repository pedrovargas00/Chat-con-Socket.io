const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://chat-socket-io-p47y.onrender.com/api/auth/';

let usuario = null;
let socket = null;

//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje  = document.querySelector('#txtMensaje');
const ulUsuarios  = document.querySelector('#ulUsuarios');
const ulMensajesPrivados = document.querySelector('#ulMensajesPrivados');
const ulMensajes  = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//Validar el token del localstorage
const validarJWT = async() => {

   const token = localStorage.getItem('token') || '';
   
   if (token.length <= 10) {
      window.location = 'index.html';
      throw new Error('No hay token en el servidor');
   }
   const res = await fetch(url, {
      headers: {'x-token': token}
   });
 
   const { usuario: userDB, token: tokenDB } = await res.json();
   
   localStorage.setItem('token', tokenDB);
   usuario = userDB;
   document.title = usuario.nombre;
   await conectarSocket();
   console.log('socket conectado');
}

const conectarSocket = async() => {

   socket = io({
      'extraHeaders': {
         'x-token': localStorage.getItem('token')
      }
   });

   socket.on('connect', () => {
      console.log('Socket online');
   });
   socket.on('disconnect', () => {
      console.log('Socket offline');
   });
   socket.on('recibir-mensajes', dibujarMensajes);
   socket.on('usuarios-activos', dibujarUsuarios);
   socket.on('mensaje-privado', dibujarMensajesPrivados);
}

const dibujarUsuarios = (usuarios = []) => {

   let usersHTML = '';
   
   usuarios.forEach(({nombre, uid}) => {
      usersHTML += `
         <li>
            <p>
               <h5 class="text-success">${nombre}</h5>
               <span class="fs-6 text muted">${uid}</span>
            </p>
         </li>
      `;
   });
   ulUsuarios.innerHTML = usersHTML;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

   const mensaje = txtMensaje.value;
   const uid = txtUid.value;

   if (keyCode !== 13) return;
   if (mensaje.length === 0) return;
   
   socket.emit('enviar-mensaje', { uid, mensaje });
   txtMensaje.value = '';
   
});

btnSalir.addEventListener('click', () => {

   socket.emit('end');
   window.location = 'index.html';
});

const dibujarMensajes = (mensajes = []) => {

   let mensajesHTML = '';
   
   mensajes.forEach(({ nombre, mensaje }) => {
      mensajesHTML += `
         <li>
            <p>
               <span class="text-primary">${ nombre }: </span>
               <span class="fs-6 text muted">${ mensaje }</span>
            </p>
         </li>
      `;
   });

   ulMensajes.innerHTML = mensajesHTML;
}

const dibujarMensajesPrivados = (mensajes) => {

   let mensajesHTML = '';

   mensajes.forEach(({ nombre, mensaje }) => {
      mensajesHTML += `
         <li>
            <p>
               <span class="text-primary">${ nombre }: </span>
               <span class="fs-6 text muted">${ mensaje }</span>
            </p>
         </li>
      `;
   });

   ulMensajesPrivados.innerHTML = mensajesHTML;
}

const main = async() => {
   await validarJWT();
}

main();