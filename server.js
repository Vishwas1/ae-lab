const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  bodyParser = require('body-parser');


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});


const routes = require('./api/routes/walletRoute')
routes(app);

app.listen(port);
console.log('AELabs RESTful API server started on: ' + port);

