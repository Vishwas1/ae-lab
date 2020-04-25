const { Node, MemoryAccount, Universal, Crypto } = require('@aeternity/aepp-sdk')
const  fetch = require('node-fetch')

function Account(keypair = {}, network){
    this.keyPair = keypair
    this.network = network

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

    this.fund = publicKey => {
        if (!publicKey) {
            return Promise.reject(`invalid public key`);
        }
        return fetch(`https://faucet.aepps.com/account/${publicKey}`, {
            method: 'POST'
        }).then(z => z.json());
    }

    this.balance = async (publicKey) => {
        console.log('inside balance =', publicKey)
        console.log(this.network.internalUrl)
        const url = `${this.network.internalUrl}/accounts/${publicKey}`
        console.log(url)
        let json = {}
        try{
            const res = await fetch(url)
            json = await res.json()
        }catch(e){
console.log(e)
        }
        return json
    }
    
    this.create = () => Promise.resolve(Crypto.generateKeyPair());

    // this.spend = (receieverPublicKey) => Promise.reject("Method not implemented")

    // this.signTx = (rawTx) => Promise.reject("Method not implemented")
}



module.exports = {
    Account
}

