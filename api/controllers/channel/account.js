const { Node, MemoryAccount, Universal, Crypto, ChainNode, AmountFormatter } = require('@aeternity/aepp-sdk')
const  fetch = require('node-fetch')

const { format, toAettos, AE_AMOUNT_FORMATS, toAe, formatAmount  } = AmountFormatter

function Account(keypair = {}, network){
    this.keyPair = keypair
    if(!keypair){
        this.keyPair = this.create()
    }
    this.network = network

    const AE_AMOUNT_FORMATS = {
        AE: 'ae',
        MILI_AE: 'miliAE',
        MICRO_AE: 'microAE',
        NANO_AE: 'nanoAE',
        PICO_AE: 'picoAE',
        FEMTO_AE: 'femtoAE',
        AETTOS: 'aettos'
      }

    this.wallet = () => {
        return new Promise(async (resolve, reject) => {
            const { url, internalUrl, networkId } = this.network
            
            if(!url) reject("Netowrk url is not defined")
            if(!internalUrl) reject("Netowrk internalUrl is not defined")
            if(!networkId) reject("Netowrk networkId is not defined")

            const { secretKey, publicKey } = this.keyPair

            if(!secretKey) reject("publicKeyl is not defined")
            if(!publicKey) reject("publicKey is not defined")
            
            const node = await Node({ url, internalUrl })
            const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
            const nodes = [{ name: networkId, instance: node }]
            const sdkInstance = await Universal({
                nodes,
                accounts: [account]
            })
            resolve(sdkInstance)
        })
    }

    this.fund = async publicKey => {
        if (!publicKey) return Promise.reject(`invalid public key`)
        if(this.network.type == "CUSTOM"){
            const wallet = await this.wallet()
            await wallet.spend(5, publicKey, { denomination: AE_AMOUNT_FORMATS.AE }) // 
        }else{   
            const resp = await fetch(`https://faucet.aepps.com/account/${publicKey}`, {
                method: 'POST'
            })
            const json =  await resp.json()
            console.log(json)
        }
        return Promise.resolve(await this.balance(publicKey))
    }

    this.balance = async (publicKey) => {
        const node = await Node({ url: this.network.url, internalUrl: this.network.internalUrl })
        const chainNode = await ChainNode({ nodes: [{ name: 'test', instance: node }], })
        return Promise.resolve(toAe(await chainNode.balance(publicKey)))
    }

    this.toAettos = toAettos
    this.toAe = toAe
    this.create = () => Crypto.generateKeyPair();

    // this.spend = (receieverPublicKey) => Promise.reject("Method not implemented")

    // this.signTx = (rawTx) => Promise.reject("Method not implemented")
}



module.exports = {
    Account
}

