/*
BALANCE [GET] https://mainnet.aeternal.io/v2/this.accounts/ak_2UqKYBBgVWfBeFYdn5sBS75B1cfLMPFSCy95xQoRo9SKNvvLgb
TOPUP  [POST] https://faucet.aepps.com/account/ak_263V5pB6dw6JnL2KoRhLpomKS6GzdWiwfr9euCU56L5LULkTfa
https://github.com/aeternity/aepp-sdk-js/blob/develop/es/channel/index.js

// Create
- channel_create_tx
// Update
- Channel_deposit_tx
- Channel_withdraw_tx
- Channel_snapshot_solo
// Close
- channel_close_mutual
- Channel_close_solo
- Channel_settle

*/

const {
    Transaction,
    MemoryAccount,
    TxBuilder,
    Crypto,
    Channel,
    Universal
} = require('@aeternity/aepp-sdk')


const keys = require('./keys.json')

const ROLE = Object.freeze({
    INITIATOR : "initiator",
    RESPONDER : "responder"
})

function CH(role, kp, responderPk){
    this.keypair = kp;
    this.params = {
        url: 'wss://testnet.aeternity.io:443/channel',
        pushAmount: 0,
        initiatorId: this.keypair.publickey,
        responderId: responderPk,
        initiatorAmount: 1e18,
        responderAmount: 1e18,
        channelReserve: 0,
        ttl: 1000, // Minimum block height to include the channel_create_tx
        host: 'localhost', //Host of the responder's node
        port: 3001, // The port of the responders node
        lockPeriod: 10, // Amount of blocks for disputing a solo close
        statePassword: 'correct horse battery staple',
        role: role
      }

    this.account = (secretKey, publicKey) => {
        return MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
    }

    
    this.open = async () => {
        const sign = async (tag, tx) => await this.account(this.keypair.secretkey, this.keypair.publickey).signTransaction(tx)
        const channel = await Channel({
            ...this.params,
            sign: async (tag, tx) => await this.account(this.keypair.secretkey, this.keypair.publickey).signTransaction(tx)
        })
    
        const status = await channel.on('statusChanged');
        if(status === 'open') this.channel = channel
    
        console.log(`Channel Id =  ${this.channel.id()}`)
        console.log(`Round = ${this.channel.round()}`) // 1
    
        return null    
    }
}


const buyerCh = new CH(ROLE.INITIATOR, keys.buyer, keys.seller.publickey);
buyerCh.open();










