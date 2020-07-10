'use strict';
const { Router }  = require('express')
const router = Router()
const contract = require('../controllers/contractController');

router.post('/compile', contract.compileContract);
router.post('/deploy', contract.deployContract);
router.post('/call', contract.callContractMethod);
router.post('/methods', contract.getContractMethods);

module.exports = router

