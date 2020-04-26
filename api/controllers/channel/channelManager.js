const { Channel, TxBuilder } = require('@aeternity/aepp-sdk')
const { Account } = require('./account')



const Role = Object.freeze({
    INITIATOR: "initiator",
    RESPONDER: "responder"
})

/**
 * ChannelManager class to manage multiple channels
 * @param {Object} network - Network object with url, interurl, channelUrl etc.
 */
function ChannelManager(network){
    if(!network) throw new Error('please pass network and keypair in constructor')
    this.network = network
    const wallet = (keypair) => new Account(keypair, this.network).wallet();
    const sign = (keypair) => (tag, tx) => wallet(keypair).then(wallet => wallet.signTransaction(tx));
    const channelList = {}
    const waitForChannelStatus = channel => status => new Promise((resolve, reject) => {
        channel.on('statusChanged', currStatus => {
            console.log(`current status: '${currStatus}' waiting for: '${status}'`);
            
            if (currStatus === status) {
                resolve(channel);
            }
        });
    
        channel.on('error', reject);
    });

    const channelState = (channel) => {
        return {
            channelId: channel.id(),
            round: channel.round(),
            status: channel.status(),
            state: channel.state(),
            fsmId: channel.fsmId()
        }
    }

    const getChannel = (channelId, publicKey) => {
        if(!channelList.hasOwnProperty(channelId)) return Promise.reject(`no channel found with id: ${channelId}`)
        if(publicKey == undefined){
            return channelList[channelId][Object.keys(channelList[channelId])[0]]
        }

        return channelList[channelId][publicKey]
    }


    /**
     * Retrieves balance of accounts in a channel.
     * @async
     * @method
     * @param {String} channelId - Channel Id
     * @returns {Array} List of balances of both accounts in a channel
     */
    this.balance = async (channelId) => {
        const { channel,params } = getChannel(channelId)
        return await channel.balances([params.initiatorId, params.responderId]);
    };

    /**
     * Retrieves status of a channel.
     * @async
     * @method
     * @param {String} channelId Channel Id
     * @returns {String} status.state.channelId Id of channel
     * @returns {String} status.state.round Number of rounds in channel
     * @returns {String} status.state.status Status of channel
     * @returns {String} status.state.state State of channel
     * @returns {String} status.state.fsmId Fsm Id
     * @returns {Object} status.balances Balances of passed accounts
     */    
    this.status = async (channelId) => {
        if(!channelId) return Promise.reject('please send the channelId')
        const { channel } = getChannel(channelId)
        const status = {
            state: channelState(channel),
            balances: await this.balance(channelId)
        }
        return status
    }

    this.setListener = (channelId, event, callback) => {
        if(!channelId) return Promise.reject('please send the channelId')
        const channel = getChannel(channelId);
        if (!callback || !(callback instanceof Function)) {
            return new Promise (resolve => channel.on(event, resolve));
        }
        channel.on(event, callback);
    } 

    /**
     * Retrieves list of active channel Ids.
     * @method
     * @returns {Array} List of channel Ids
     */
    this.getChannelIds = () => {
        return Object.keys(channelList)
    }

    /**
     * Creates new channel
     * @async
     * @method
     * @param {String} config.initiatorId Publickey of initiator
     * @param {String} config.responderId Publickey of responder
     * @param {Int} config.initiatorDeposit Amount that initiator wants to deposit
     * @param {Int} config.responderDeposit Amount that responder wants to deposit
     * @param {String} config.host Hostname of responder
     * @param {Int} config.port Port of responder
     * @param {Role} config.role Role [INITIATOR | RESPONDER]
     * @param {Object} config.keypair Private and Public key pair
     * @returns {String} state.channelId Id of channel
     * @returns {String} state.round Number of rounds in channel
     * @returns {String} state.status Status of channel
     * @returns {String} state.state State of channel
     * @returns {String} state.fsmId Fsm Id
     */
    this.add = (config) => {
        const {initiatorId, responderId, initiatorDeposit, responderDeposit, host, port, role, keypair} = config;
    
        if (!initiatorId || !responderId || !initiatorDeposit || !host || !port || !role) {
            return Promise.reject(`please send all the config parameters {network: (${JSON.stringify(network)}), initiatorId: (${JSON.stringify(initiatorId)}), responderId: (${JSON.stringify(responderId)}), initiatorDeposit: (${JSON.stringify(initiatorDeposit)}),host: (${JSON.stringify(host)}), port: (${JSON.stringify(port)}), role: (${JSON.stringify(role)}), keypair: ${JSON.stringify(keypair)}}`)
        }

        const params = {
            url: this.network.channelUrl,
    
            initiatorId: initiatorId,
            responderId: responderId,
    
            initiatorAmount: initiatorDeposit,
            responderAmount: responderDeposit,
    
            pushAmount: 0,
            channelReserve: 0,
            ttl: 1000,
            host: host,
            port: port,
            lockPeriod: 10,
            minimumDepth: 0,
    
            role: role,
          }
    
        return Channel({
            ...params,
            sign: sign(keypair)
        })
          .then(channel => waitForChannelStatus(channel)('open'))
          .then(channel => {
              const channelId = channel.id();
              console.log('channelId: ', channelId);
              if(channelList[channelId] == undefined) channelList[channelId] = {}
              channelList[channelId][keypair.publicKey] = {
                    params: params,
                    channel: channel
                }
              return channelState(channel)
          })
    };
    
    /**
     * Sends money from one account to another
     * @async
     * @method
     * @param {String} params.channelId Channel Id
     * @param {Object} params.keypair Private and Public key pair
     * @param {String} params.senderPublicKey Public key of spender's
     * @param {String} params.receiverPublicKey Public key of beneficiary
     * @param {Int} params.amount Amount to be spent (in Aetoss)
     * @param {String} params.memo Message
     * @returns {String} result.txstatus Status of the transaction
     * @returns {String} result.signedTx Signed transaction 
     * @returns {String} status.round Number of rounds in channel
     * @returns {String} status.status Status of channel
     * @returns {String} status.state State of channel
     * @returns {String} status.fsmId Fsm Id
     * @returns {Object} status.balances Balances of passed accounts
     */
    this.update = async (params) => {
        const { channelId, keypair, senderPublicKey, receiverPublicKey, amount, memo } = params
        if(!channelId || !senderPublicKey || !receiverPublicKey || !amount) return Promise.reject(`either of these parameters are empty: channelId, senderPublicKey, receiverPublicKey, amount`)
        const { channel } = getChannel(channelId, keypair.publicKey)
        const account = new Account(keypair, this.network)
        const wallet = await account.wallet()
        return channel.update(
            senderPublicKey, 
            receiverPublicKey,
            parseInt(amount),
            async (tx) => wallet.signTransaction(tx),
            [memo]
        ).then(async (result) => {
            return {
                result: result,
                status: await this.status(channelId)
            }
        })
    }

    /**
     * Disconnect the channel
     * @async
     * @method
     * @param {String} channelId Channel Id
     * @returns {String} result.status Id of channel
     * @returns {String} result.signedTx Number of rounds in channel
     */ 
    this.leave = async (channelId, publicKey) => {
        if(!channelId) return Promise.reject('please send the channelId')
        if(!publicKey) return Promise.reject('please send the publicKey')
        const {channel} = getChannel(channelId, publicKey)
        const result = await channel.leave();
        channelList[channelId][publicKey].offchainTx = result.signedTx
        return result
    }

    /**
     * Reconnect the channel
     * @async
     * @method
     * @param {String} channelId Channel Id
     * @param {Object} keypair Private and Public key pair
     * @returns {Boolean} isConnected True or false 
     */ 
    this.reconnect = async (channelId, keypair) => {
        if(!channelId) return Promise.reject('please send the channelId')
        const { params, channel, offchainTx } = getChannel(channelId, keypair.publicKey)
        if(!offchainTx) return Promise.reject('can not reconnect before leaving the channel')
        const round = channel.round();
        const fsmId = channel.fsmId();
        const account = new Account(keypair, this.network)
        const wallet = await account.wallet()
        return Channel({
            url: params.url,
            host: params.host,
            port: params.port,
            role: params.role,
            round,
            existingChannelId: channelId,
            offchainTx,
            existingFsmId: fsmId,
            sign: async (tx) => wallet.signTransaction(tx)
          }).then(channel => {
                return waitForChannelStatus(channel)('open')
          }).then(async (ch) => {
                channelList[channelId][keypair.publicKey].channel = ch
                return true 
          })
    }

    /**
     * Close the channel
     * @async
     * @method
     * @param {String} channelId Channel Id
     * @param {Object} keypair Private and Public key pair
     * @returns {String} txType Type of transaction (Ex. mutualClose)
     * @returns {String} tx The transaction
     */ 
    this.close = async (channelId, keypair) => {
        if(!channelId || !keypair) return Promise.reject('please send the channelId and keypair')
        const {channel} = getChannel(channelId, keypair.publicKey)
        const account = new Account(keypair, this.network)
        const wallet = await account.wallet()
        const result = await channel.shutdown(
            async (tx) => await wallet.signTransaction(tx)
        )
        delete channelList[channelId] 
        const { txType, tx } = TxBuilder.unpackTx(result)
        return {
            result,
            txType, 
            tx
        }

    }       
}

module.exports = {
    ChannelManager,
    Role
}
