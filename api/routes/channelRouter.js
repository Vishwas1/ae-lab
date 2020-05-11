'use strict';
module.exports = function(app, keycloak) {
  var channel = require('../controllers/channelController');
    

  app.get('/testing',  keycloak.protect(),  (req, res) => res.json("Hello"))
  app.route('/setup')
    .post(channel.setup);

  app.route('/connect')
    .post(channel.connect);

  app.route('/offspend')
    .post(channel.spend);

  app.route('/status')
    .get(channel.status);
  
  app.route('/balance')
    .get(channel.accountbalance);

  app.route('/fund')
    .get(channel.fund);

  app.route('/reconnect')
    .post(channel.reconnect);

  app.route('/close')
    .post(channel.close);
  
  app.route('/leave')
    .post(channel.leave);


};




/*
router.get('/setup', (req, res) => channelService.setup().then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/connect', (req, res) => channelService.connect({
    responderId: req.query.responder, 
    initiatorAmount: req.query.initBalance
}).then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/spend', (req, res) => channelService.spend(req.query.channelId).then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/channels', (req, res) => channelService.channelList().then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/channels/:channelId', (req, res) => channelService.channelList(req.params.channelId).then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/status/:channelId', (req, res) => channelService.getChannelStatus(req.params.channelId).then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/reconnect', (req, res) => channelService.reconnect(req.query.channelId).then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/close', (req, res) => channelService.close(req.query.channelId).then(RH.handleSuccess(res)).catch(RH.handleError(res)));

router.get('/leave', (req, res) => channelService.leave(req.query.channelId).then(RH.handleSuccess(res)).catch(RH.handleError(res)));
*/