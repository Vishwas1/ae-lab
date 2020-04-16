const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const http = require('http')
const ws = require('./wsserver')
  
const server = http.createServer(app) //Creating HTTP server using express
ws(server)

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});


const walletRoutes = require('./api/routes/walletRoute')
walletRoutes(app);

const contractRoutes = require('./api/routes/contractRoute')
contractRoutes(app);


server.listen(port);
console.log('AELabs RESTful API server started on: ' + port);

