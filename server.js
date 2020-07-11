const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const network_conf = require('./config').network
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
app.use(cookieParser());
const allowedOrigins = ['http://localhost:3000', 'https://ae-labs.herokuapp.com/'];

const server = http.createServer(app) //Creating HTTP server using express
ws(server)

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use((req, res, next) => {
  let network = {}
  if (req.cookies && req.cookies['NETWORK_CONFIG']) {
    let cookie_conf;
    try{
      cookie_conf = JSON.parse(req.cookies['NETWORK_CONFIG'])
      console.log(cookie_conf)
      switch(cookie_conf.type){
        case "CUSTOM": {
          const nodeUrl = cookie_conf.url;
          const chUrl = cookie_conf.channelUrl
          network = {
            url: nodeUrl, 
            internalUrl: nodeUrl, 
            channelUrl: chUrl ? `${chUrl.replace('http', 'ws')}/channel` : "",
            compilerUrl: '',
            networkId: cookie_conf.networkId,
            minerPrivateKey: cookie_conf.minerPrivateKey,
            type: "CUSTOM"
          }
          break;
        }
        case "TESTNET": {
          network = network_conf.test
          break
        }
        case "MAINNET": {
          network = network_conf.test
          break
        }
        default: {
          network = network_conf.test
        }
      }
    }catch(e){
      network = network_conf.test
    }
  }else{
    network = network_conf.test
  }
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  req.network = network
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
app.use('/api/wallet', walletRoutes)

const contractRoutes = require('./api/routes/contractRoute')
app.use('/api/contract', contractRoutes)

const channelRoutes =  require('./api/routes/channelRouter')
channelRoutes(app, keycloak)

const trainingRoutes =  require('./api/routes/trainingRouter')
trainingRoutes(app)

server.listen(port);
console.log('AELabs RESTful API server started on: ' + port);

