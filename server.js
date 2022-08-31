const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

//Cria http , define uma porta padrão e define o server passando app
const server = http.createServer(app);
server.listen(port);