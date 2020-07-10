'use strict';
const wallet = require('../controllers/walletController');
const { Router }  = require('express')
const router = Router()

router.post('/network', wallet.setNetwork)
router.get('/account',wallet.generateKeyPair);
router.post('/build', wallet.buildTx);
router.post('/sign', wallet.signTx);
router.post('/decode',wallet.parseTx);
router.post('/spend', wallet.spendTx)

module.exports = router




