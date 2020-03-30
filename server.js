const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
  

const routes = require('./api/routes/walletRoute')
routes(app);

app.listen(port);
console.log('AELabs RESTful API server started on: ' + port);

