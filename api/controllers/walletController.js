const { Crypto, TxBuilder,Node, RpcWallet, RpcAepp, MemoryAccount, Universal } = require('@aeternity/aepp-sdk')

const {
  statusTypeEnum,
  sendFormattedResponse
} = require('../utils/utils')


const url = process.env.TEST_URL || 'https://sdk-testnet.aepps.com'
const internalUrl = process.env.TEST_INTERNAL_URL || 'https://sdk-testnet.aepps.com'
const compilerUrl = process.env.COMPILER_URL || 'https://compiler.aepps.com'
const networkId = process.env.TEST_NETWORK_ID || 'ae_devnet'


const getSDKInstance = async () => {
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

    const aepp =  await getSDKInstance();
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
  spendTx
}