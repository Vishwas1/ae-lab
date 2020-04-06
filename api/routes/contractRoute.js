'use strict';
module.exports = function(app) {
  var contract = require('../controllers/contractController');
    
  app.route('/compile')
    .post(contract.compileContract);

  app.route('/deploy')
    .post(contract.deployContract);

  app.route('/call')
    .post(contract.callContractMethod);

  app.route('/methods')
    .post(contract.getContractMethods);

};

