const { network } = require('../../config')
const { ChannelManager, Role } = require('./channel/channelManager')
const { Account} = require('./channel/account')
const { statusTypeEnum, sendFormattedResponse } = require('../utils/utils')

const minerAccount = {
    secretKey: "bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca",
    publicKey: "ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU"
}

const channel = new ChannelManager(network.dev)
// Responder
const setup = async (req, res) => {
    try{        
        const { initiatorPublicKey, responderPublicKey, initiatorAmount, responderAmount, keypair } = req.body
        const config = {
            initiatorId: initiatorPublicKey, 
            responderId: responderPublicKey, 
            initiatorDeposit: initiatorAmount, 
            responderDeposit: responderAmount, 
            host: 'localhost', 
            port: '3000', 
            role: Role.RESPONDER,
            keypair: keypair
        }
        const result = await channel.add(config)   
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

// Initiator
const connect = async (req, res) => {
    try{        
        const { initiatorPublicKey, responderPublicKey, initiatorAmount, responderAmount, keypair } = req.body
        const config = {
            initiatorId: initiatorPublicKey, 
            responderId: responderPublicKey, 
            initiatorDeposit: initiatorAmount, 
            responderDeposit: responderAmount, 
            host: 'localhost', 
            port: '3000', 
            role: Role.INITIATOR,
            keypair: keypair
        }
        const result = await channel.add(config)   
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const spend = async (req, res) => {
    try{
        const { channelId, keypair, amount, receiverPublicKey, memo } = req.body
        const params  = { 
            channelId: channelId, 
            keypair: keypair, 
            senderPublicKey: keypair.publicKey, 
            receiverPublicKey: receiverPublicKey, 
            amount: amount, 
            memo: memo 
        }
        const result = await channel.update(params) 
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const status = async (req, res) => {
    try{
        const result = await channel.status(req.query.channelId)
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }    
}

const reconnect = async (req, res) => {
    try{
        const { channelId, keypair } = req.body
        const result = await channel.reconnect(channelId, keypair)
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    } 
}

const close = async (req, res) => {
    try{
        const { channelId, keypair } = req.body
        const result = await channel.close(channelId, keypair)
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const leave = async (req, res) => {
    try{
        const { channelId, publicKey } = req.body
        const result = await channel.leave(channelId, publicKey)
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const accountbalance = async (req, res) => {
    try{
        const account = new Account({},network.dev);
        const result = await account.balance(req.query.publicKey)
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const fund = async (req, res) => {
    try{
        const account = new Account(minerAccount,network.dev);
        const result = await account.fund(req.query.publicKey)
        return sendFormattedResponse(res, result, statusTypeEnum.OK); 
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

module.exports = {
    setup,
    connect,
    spend, 
    status,
    close,
    leave, 
    reconnect,
    accountbalance,
    fund
}