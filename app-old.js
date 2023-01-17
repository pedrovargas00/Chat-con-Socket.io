const http = require('http');

//Request: Es la solicitud del cliente a la web.
//Response: Respuesta a esa petición.
http.createServer((request, response) => {
   //response.setHeader('Content-Disposition', 'attachment; filename=lista.csv');
   //response.writeHead(200, {'Content-Type': 'application/csv'});
   //Regresar un objeto como respuesta
   /*const persona = {
      id: 1,
      nombre: 'Mario'
   };
   response.write(JSON.stringify(persona));*/
   //response.write('id, nombre\n');
   //response.write('1, Fernando\n');
   //response.write('2, María\n');
   //response.write('3, Juan\n');
   //response.write('4, Pedro\n');
   response.write('Hola Mundo');
   response.end();
}).listen(8080);
console.log('Escuchando petición en puerto 8080');