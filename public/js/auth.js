const formulario = document.querySelector('form');
const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080'
            : 'https://chat-socket-io-p47y.onrender.com';

formulario.addEventListener('submit', async (ev) => {

   ev.preventDefault();
   const formData = {};

   for (let ele of formulario.elements)
      if (ele.name.length > 0)
         formData[ele.name] = ele.value;

   await fetch(url + 'login', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {'Content-Type': 'application/json'}
   })
   .then(res => res.json())
   .then(({token}) => {
      if (!token)
         return console.error('Falló el login');
      localStorage.setItem('token', token);
      window.location = 'chat.html';
   })
   .catch(err => { console.log(err); });
});

async function handleCredentialResponse(response) {
   //Google Token: ID_TOKEN

   const body = {id_token: response.credential};

   await fetch(`${url}/api/auth/google`, {
      method: 'POST',
      headers: {
         'Content-Type':'application/json'
      },

      body: JSON.stringify(body)
   })
   .then(res => res.json())
   .then(({token}) => {
      localStorage.setItem('token', token);
      window.location = 'chat.html';
   })
   .catch(err => { console.log(err); });
      /*.then(res => {
         console.log(res);
         localStorage.setItem('email', res.usuario.correo)})
      .catch(console.warn);*/
}

const button = document.getElementById('google_signout');
button.onclick = () => {
   console.log(google.accounts.id);
   google.accounts.id.disableAutoSelect();
   google.accounts.id.revoke(localStorage.getItem('email'), done => {
      localStorage.clear();
      location.reload();
   });
}