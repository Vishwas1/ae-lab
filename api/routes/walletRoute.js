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


  // app.route('/tasks')
  //   .get(todoList.list_all_tasks)
  //   .post(todoList.create_a_task);

  // app.route('/tasks/:taskId')
  //   .get(todoList.read_a_task)
  //   .put(todoList.update_a_task)
  //   .delete(todoList.delete_a_task);
};


/*
Configure network
Account Creator
Build Transaction
Sign Transaction
Decode Transaction
*/