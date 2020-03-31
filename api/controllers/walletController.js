const { Crypto, TxBuilder,Node, RpcWallet, RpcAepp, MemoryAccount, Universal } = require('@aeternity/aepp-sdk')



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
  const { secretKey, publicKey, rawTx } =  req.body;

  const node = await Node({ url, internalUrl })
  const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
  const nodes = [{ name: 'testnet-node', instance: node }]
  const sdkInstance = await Universal({
    nodes,
    accounts: [account]
  })

  const signed = await sdkInstance.signTransaction(rawTx)
  res.json(await sdkInstance.sendTransaction(signed, {
    waitMined : false,
    verify : true
  }))
}

const signTx = async (req, res) => {
  const { secretKey, publicKey, rawTx } =  req.body;

  const node = await Node({ url, internalUrl })
  const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
  const nodes = [{ name: 'testnet-node', instance: node }]
  const sdkInstance = await Universal({
    nodes,
    accounts: [account]
  })

  const signed = await sdkInstance.signTransaction(rawTx)
  res.json({
    rawTx: rawTx,
    signTx: signed 
  });

  const aepp =  await getSDKInstance();
  await aepp.signTransaction(rawTx)
}

const parseTx = (req, res) => {
  const { tx } =  req.body;
  const deserializedTx = TxBuilder.unpackTx(tx)
  res.json({
    rawTx: tx,
    parsedTx: deserializedTx 
  });
}

module.exports = {
  test: (req, res) => {
    res.json('hello!')
  },
  setNetwork: (req, res) => {
    res.json({
      
    });
  },
  generateKeyPair: (req, res) => {
    const  { publicKey, secretKey } = Crypto.generateKeyPair()
    res.json({
      publicKey : publicKey,
      secretKey : secretKey
    })
  },
  buildTx: async (req, res) => {
    let { sender, receiver,  amount, payload } = req.body;

    /**Test params */
    // sender = "ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR"
    // receiver = "ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR"
    // amount = 1000
    // payload = "ba_aGVsbG+Vlcnf"

    const aepp =  await getSDKInstance();
    const rawTx = await aepp.spendTx({ senderId: sender, recipientId: receiver, amount: amount, payload: payload })
    res.json({
      rawTx
    })
  },
  signTx,
  parseTx,
  spendTx
}