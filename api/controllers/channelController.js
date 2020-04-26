const { network } = require('../../config')
const { ChannelManager, Role } = require('./channel/channelManager')
const { statusTypeEnum, sendFormattedResponse } = require('../utils/utils')

const channel = new ChannelManager(network.dev);

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

module.exports = {
    setup,
    connect,
    spend, 
    status,
    close,
    leave, 
    reconnect
}