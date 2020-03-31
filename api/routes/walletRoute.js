'use strict';
module.exports = function(app) {
  var wallet = require('../controllers/walletController');
    
  app.route('/network')
    .post(wallet.setNetwork)

  app.route('/account')
    .get(wallet.generateKeyPair);
  
  app.route('/build')
    .post(wallet.buildTx);

  app.route('/sign')
    .post(wallet.signTx);

  app.route('/decode')
    .post(wallet.parseTx);

  app.route('/spend')
    .post(wallet.spendTx)

};


/*
Configure network
Account Creator
Build Transaction
Sign Transaction
Decode Transaction
*/