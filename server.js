const express = require('express')
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const http = require('http')
const ws = require('./ws/channelSocket')

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

//session
app.use(session({
  secret:'this_should_be_long_text',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());

const allowedOrigins = ['http://localhost:3000', 'https://ae-labs.herokuapp.com/'];

const server = http.createServer(app) //Creating HTTP server using express
ws(server)

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use((req, res, next) => {
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

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

const channelRoutes =  require('./api/routes/channelRouter')
channelRoutes(app, keycloak)

server.listen(port);
console.log('AELabs RESTful API server started on: ' + port);

