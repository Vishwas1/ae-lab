const { Crypto, TxBuilder } = require('@aeternity/aepp-sdk')

const  generateKeyPair  = (req, res) => {
  console.log('here')
  const  { publicKey, secretKey } = Crypto.generateKeyPair()
  res.json({
    publicKey : publicKey,
    secretKey : secretKey
  })
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
    console.log('here')
    const  { publicKey, secretKey } = Crypto.generateKeyPair()
    res.json({
      publicKey : publicKey,
      secretKey : secretKey
    })
  },
  buildTx: (req, res) => {
    const { sender, receiver,  amount } =  req.body;
     
    res.json({

    })
  },
  signTx,
  parseTx
}