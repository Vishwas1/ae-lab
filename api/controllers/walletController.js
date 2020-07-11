const { Crypto, TxBuilder,Node, RpcWallet, RpcAepp, MemoryAccount, Universal, Keystore } = require('@aeternity/aepp-sdk')
const { getAddressFromPriv } = Keystore
const { Account} = require('./channel/account')

const {
  statusTypeEnum,
  sendFormattedResponse
} = require('../utils/utils')



const getSDKInstance = async (network) => {
  const { url, internalUrl } = network
  const node = await Node({ url, internalUrl })
  const aepp = await RpcAepp({
    name: 'AEPP',
    nodes: [{ name: 'test', instance: node }],
    onNetworkChange (params) {
    },
    onAddressChange: (addresses) => {
    },
    onDisconnect (a) {
    }
  })
  return aepp
}

const spendTx = async (req, res) => {
  try{
    const { secretKey, publicKey, rawTx, verify, waitMined } =  req.body;

    if(!secretKey || secretKey == "") throw new Error("SecretKey is null or empty")
    if(!publicKey || publicKey == "") throw new Error("publicKey is null or empty")
    if(!rawTx || rawTx == "") throw new Error("Raw Transaction is null or empty")

    const { url, internalUrl } = req.network
    const node = await Node({ url, internalUrl })
    const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
    const nodes = [{ name: 'testnet-node', instance: node }]
    const sdkInstance = await Universal({
      nodes,
      accounts: [account]
    })
  
    const signed = await sdkInstance.signTransaction(rawTx)
    const data = await sdkInstance.sendTransaction(signed, {
      waitMined : waitMined,
      verify : verify
    })

    return sendFormattedResponse(res, data, statusTypeEnum.OK);
  }catch(e){
    return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
}

const signTx = async (req, res) => {
  try{
    const { secretKey, publicKey, rawTx } =  req.body;
    if(!secretKey || secretKey == "") throw new Error("SecretKey is null or empty")
    if(!publicKey || publicKey == "") throw new Error("publicKey is null or empty")
    if(!rawTx || rawTx == " ") throw new Error("Raw Transaction is null or empty")


    const { url, internalUrl } = req.network
    const node = await Node({ url, internalUrl })
    const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
    const nodes = [{ name: 'testnet-node', instance: node }]
    const sdkInstance = await Universal({
      nodes,
      accounts: [account]
    })
  
    const signed = await sdkInstance.signTransaction(rawTx)
    console.log(signed)
    const data = {
      rawTx: rawTx,
      signTx: signed 
    };
    return sendFormattedResponse(res, data, statusTypeEnum.OK);
  }catch(e){
    return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
  
}

const parseTx = (req, res) => {
  try{
    const { tx } =  req.body;
    if(!tx || tx == " ") throw new Error("Signed Transaction is null or empty")

    const deserializedTx = TxBuilder.unpackTx(tx)
    const data = {
      rawTx: tx,
      parsedTx: deserializedTx 
    }
    return sendFormattedResponse(res, data, statusTypeEnum.OK);
  }catch(e){
    return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
}

const buildTx = async (req, res) => {
  try{
    let { sender, receiver,  amount, payload } = req.body;
    if(!sender || sender == " ") throw new Error("Spender publicKey is null or empty")
    if(!receiver || receiver == " ") throw new Error("Receiver publicKey is null or empty")
    if(!amount || amount == " ") throw new Error("Amount publicKey is null or empty")

    const aepp =  await getSDKInstance(req.network);
    const rawTx = await aepp.spendTx({ senderId: sender, recipientId: receiver, amount: amount, payload: payload })
    const data = {
      rawTx
    }
    return sendFormattedResponse(res, data, statusTypeEnum.OK);
  }catch(e){
    return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
}

const generateKeyPair = (req, res) => {
  try{
    const  { publicKey, secretKey } = Crypto.generateKeyPair()
    const data = {
      publicKey : publicKey,
      secretKey : secretKey
    }
    return sendFormattedResponse(res, data, statusTypeEnum.OK);
  }catch(e){
    return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
}

const balance = async (req, res) => {
  try{
      const account = new Account({}, req.network);
      const result = await account.balance(req.query.publicKey)
      return sendFormattedResponse(res, result, statusTypeEnum.OK); 
  }catch(e){
      return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
}

const fund = async (req, res) => {
  try{
    let minerAccount = {}
    if(req.network.minerPrivateKey){
      minerAccount = {
        secretKey: req.network.minerPrivateKey,
        publicKey: getAddressFromPriv(req.network.minerPrivateKey)
      }
    }
    console.log(minerAccount)
    const account = new Account(minerAccount, req.network);
    const result = await account.fund(req.query.publicKey)
    return sendFormattedResponse(res, result, statusTypeEnum.OK); 
  }catch(e){
    return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
  }
}

module.exports = {
  test: (req, res) => {
    res.json('hello!')
  },
  setNetwork: (req, res) => {
    res.json({
      
    });
  },
  generateKeyPair,
  buildTx,
  signTx,
  parseTx,
  spendTx,
  balance,
  fund
}