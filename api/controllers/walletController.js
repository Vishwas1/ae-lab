const { Crypto, TxBuilder,Node, RpcWallet, RpcAepp, MemoryAccount } = require('@aeternity/aepp-sdk')



const url = process.env.TEST_URL || 'https://sdk-testnet.aepps.com'
const internalUrl = process.env.TEST_INTERNAL_URL || 'https://sdk-testnet.aepps.com'
const compilerUrl = process.env.COMPILER_URL || 'https://compiler.aepps.com'
const networkId = process.env.TEST_NETWORK_ID || 'ae_devnet'


const  generateKeyPair  = (req, res) => {
  console.log('here')
  const  { publicKey, secretKey } = Crypto.generateKeyPair()
  res.json({
    publicKey : publicKey,
    secretKey : secretKey
  })
}

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
  const { secretKey, publicKey, signedTx } =  req.body;
  const account = MemoryAccount({ keypair: { secretKey: secretKey, publicKey: publicKey } })
  const nodes = [{ name: 'testnet-node', instance: node }]
  const sdkInstance = await Universal({
    nodes,
    accounts: [account]
  })

  // const signed = await sdkInstance.signTransaction(spendTx)
  res.json(await sdkInstance.sendTransaction(signedTx, {
    waitMined : false,
    verify : true
  }))
}

const signTx = (req, res)  => {
  const { tx, privKey } = req.body;
  if (!tx.match(/^tx_.+/)) {
    throw Error('Not a valid transaction')
  }

  const binaryKey = (() => {
    if (program.file) {
      return fs.readFileSync(program.file)
    } else if (privKey) {
      return Buffer.from(privKey, 'hex')
    } else {
      throw Error('Must provide either [privkey] or [file]')
    }
  })()

  const decryptedKey = program.password ? Crypto.decryptKey(program.password, binaryKey) : binaryKey

  // Split the base58Check part of the transaction
  const base58CheckTx = tx.split('_')[1]
  // ... and sign the binary create_contract transaction
  const binaryTx = Crypto.decodeBase58Check(base58CheckTx)

  const signature = Crypto.sign(binaryTx, decryptedKey)

  // the signed tx deserializer expects a 4-tuple:
  // <tag, version, signatures_array, binary_tx>
  const unpackedSignedTx = [
    Buffer.from([11]),
    Buffer.from([1]),
    [Buffer.from(signature)],
    binaryTx
  ]
  const signedTx = Crypto.encodeTx(unpackedSignedTx)
  console.log(signedTx)
  res.json({
    rawTx: tx,
    signTx: signTx 
  });
}

const parseTx = (req, res) => {
  const { tx } =  req.body;
  const deserializedTx = TxBuilder.unpackTx(tx)
  console.log(JSON.stringify(deserializedTx, undefined, 2))
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
    sender = "ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR"
    receiver = "ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR"
    amount = 1000
    payload = "ba_aGVsbG+Vlcnf"

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