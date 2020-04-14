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

function CH(){
    this.params = {
        url: 'wss://testnet.aeternity.io:443/channel',
        pushAmount: 3,
        initiatorId: keys.buyer.publicKey,
        responderId: keys.seller.publicKey,
        initiatorAmount: 1e18,
        responderAmount: 1e18,
        channelReserve: 0,
        ttl: 1000, // Minimum block height to include the channel_create_tx
        host: 'localhost', //Host of the responder's node
        port: 3001, // The port of the responders node
        lockPeriod: 10, // Amount of blocks for disputing a solo close
        statePassword: 'correct horse battery staple'
      }

    this.account = (secretKey, publicKey) => {
        return MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
    }

    this.open = async () => {
        const channel = await Channel({
            ...this.params,
            initiatorId: this.account.publicKey,
            role: 'initiator',
            sign: await this.account.signTransaction(tx)
        })
    
        const status = await channel.on('statusChanged');
        if(status === 'open') this.channel = channel
    
        console.log(`Channel Id =  ${this.channel.id()}`)
        console.log(`Round = ${this.channel.round()}`) // 1
    
        return null    
    }
    
    
    this.updateChannel = async () => {
        const meta = 'meta 1'
        const result = await this.channel.update(
            'ak_Y1NRjHuoc3CGMYMvCmdHSBpJsMDR6Ra2t5zjhRcbtMeXXLpLH', //Sender's public address
            'ak_V6an1xhec1xVaAhLuak7QoEbi6t7w5hEtYWp9bMKaJ19i6A9E', //Receiver's public address
            amount,
            async (tx) => await this.account.signTransaction(tx), //Function which verifies and signs offchain transaction
            [meta] // met
    
          )
        //{ accepted, signedTx }
        console.log(result.accepted)
        console.log(result.signedTx)
        console.log(`Round after ishwaupdate = ${this.channel.round()}`)
    }
    
    this.getBalances = async (address) => {
        return await this.channel.balances(address)
    }
    
    this.sendMessage = async (message, recipient) => {
        //Send generic message
        await this.channel.sendMessage(
            message,
            recipient
        )
        const message = await this.channel.on('message')
        console.log(message)
    }
    
    this.listeners = {
        //After the other party had signed the withdraw/deposite transaction, 
        //the transaction is posted on-chain and `onOnChainTx` callback is called with on-chain transaction as first argument.
        onOnChainTx : (on_chain_tx) => {},
    
        //After computing transaction hash it can be tracked on the chain: entering the mempool, block inclusion and a number of confirmations.
        //After the minimum_depth block confirmations onOwnWithdrawLocked callback is called
        onOwnWithdrawLocked : () => {},
    
        //After the minimum_depth block confirmations onOwnDepositLocked callback is called (without any arguments).
        onOwnDepositLocked : () => {},
    
        //When the other party had confirmed that the block height needed is reached onWithdrawLocked callback is called
        onWithdrawLocked : () => {},
    
        //When the other party had confirmed that the block height needed is reached onDepositLocked callback is called 
        onDepositLocked : () => {},
    
        error : () => {}
    }
    
    this.withDraw = async  () => {
        //channel_withdraw_tx 
        //After the channel had been opened any of the participants can initiate a withdrawal.
        //The process closely resembles the update. The most notable difference is that the transaction has been co-signed
        
        const result = await this.channel.withdraw(
            amount,
            await this.account.signTransaction(tx),
            { onOnChainTx, onOwnWithdrawLocked, onWithdrawLocked } = listeners
          )
    
        const { accepted, signedTx } =  result;
        console.log(`WITHDRAW: accepted = ${accepted}`)
        console.log(`WITHDRAW: signedTx = ${signedTx}`)
    }
    
    
    this.deposite = async () => {
        //channel_deposit_tx
        //After the channel had been opened any of the participants can initiate a deposit.
        
        const result = await this.channel.deposit(
            amount,
            await this.account.signTransaction(tx),
            { onOnChainTx, onOwnDepositLocked, onDepositLocked } = listeners
          )
        const { accepted, signedTx } =  result;
        const { txType, tx }  = TxBuilder.unpackTx(signedTx)
        console.log(`DEPOSITE: accepted = ${accepted}`)
        console.log(`DEPOSITE: txType = ${txType}`) //channelDeposit
        console.log(`DEPOSITE: tx = ${tx}`)
    
    }
    
    
    this.close = async () => {
        //Trigger mutual close
        //At any moment after the channel is opened, a closing procedure can be triggered.
        //This can be done by either of the parties
    
        const result = await this.channel.shutdown(sign)
        const { txType, tx }  = TxBuilder.unpackTx(result)
    
        console.log(`CLOSE: txType = ${txType}`) //channelCloseMutual
        console.log(`CLOSE: tx = ${tx}`)
    
    }
    
    this.leave = async () => {
        //It is possible to leave a channel and 
        //then later reestablish the channel off-chain state and continue operation. When a leave method is called, 
        //the channel fsm passes it on to the peer fsm, reports the current mutually signed state and then terminates.
        //The channel can be reestablished by instantiating another Channel instance with two extra params: existingChannelId and offchainTx 
        //(returned from leave method as channelId and signedTx respectively).
    
        const result = await this.channel.leave();
        const { channelId, signedTx } = result;
        console.log(`LEAVE: offchainTx = ${signedTx}`)
        console.log(`LEAVE: channelId = ${channelId}`)
    
    }
    
    
    this.reconnect = async (existingChannelId, offchainTx) => {
        this.channel = await Channel({
            ...this.params,
            role: 'initiator',
            port: 3002,
            [existingChannelIdKey]: existingChannelId,
            offchainTx,
            sign: await this.account.signTransaction(tx)
          })
        
        const status = await channel.on('statusChanged');
        if(status === 'open') {
            this.channel = channel
            console.log(`RE-CONNECT: channel [${existingChannelId} is reconnected]`)
        }
    
    }
}












