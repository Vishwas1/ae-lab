const Deployer = require('aeproject-lib').Deployer;

const config = {
	host: "https://sdk-testnet.aepps.com/",
	internalHost: "https://sdk-testnet.aepps.com/",
	gas: 200000,
	ttl: 55
}

// We'll need the main client module `Ae` in the `Universal` flavor from the SDK.
const { Universal: Ae, Node, RpcAepp, MemoryAccount, Wallet, RpcWallet, Universal } = require('@aeternity/aepp-sdk')
const program = require('commander')
// const fs = require('fs')

async function exec (infile, fn, args) {
  
  
  
  const code = `
  contract ExampleContract =

  public function say_hello(name : string) : string = 
    String.concat("Hello, ", name)

  public function donate() : int =
    Call.value
  `

  const NODE_URL = 'https://sdk-testnet.aepps.com' 
  const NODE_INTERNAL_URL = 'https://sdk-testnet.aepps.com'
  const COMPILER_URL = 'https://compiler.aepps.com'
  const privateKey = '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd'
    // const node = await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL })
  let deployer = new Deployer('testNode', 'ae_devnet' , privateKey);
  const deployedContract = await deployer.deploy( code, []); // empty array for init params
  console.log(deployedContract)



//   const node = await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL })
//   process.env.WALLET_PRIV = '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd'
//   process.env.WALLET_PUB = 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ'
//   // const client = await Ae({ debug: true, process, nodes: [{ name: 'test-net', instance: node }] })
//   const client = await Ae({
//     debug: true, 
//     process,
//     name: 'AEPP',
//     nodes: [{ name: 'test-net', instance: node }],
//     compilerUrl: COMPILER_URL
//   })
  
//   let compileBytecodeResponse = await client.contractCompile(code)
//   console.log(`The code is complied, bytecode = ${compileBytecodeResponse.bytecode}`)
  
//   // const walletInstance = await Wallet({
//   //   nodes: [{ name: 'test-net', instance: node }],    
//   //   compilerUrl: COMPILER_URL,
//   //   name: 'Wallet',
//   //   accounts: [
//   //     MemoryAccount({ keypair: { secretKey: '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd', publicKey: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ' } }),
//   //   ],
//   //   address: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ',
//   // })
//   // compileBytecodeResponse = await walletInstance.contractCompile(code)
//   // console.log(`The code is complied, bytecode = ${compileBytecodeResponse.bytecode}`)
  
// // return
//   // const connection = await walletInstance.getConnection()
//   // console.log(connection)

//   // await client.connectToWallet(connection)
//   const deployedInstance = await compileBytecodeResponse.deploy({ initState: [] })
  
//   console.log(`Deployed at address = ${deployedInstance.addresses}`)
  // await client.disconnectWallet()
}

const getWallet  =  async () => {
  
  const NODE_URL = 'https://sdk-testnet.aepps.com' 
  const NODE_INTERNAL_URL = 'https://sdk-testnet.aepps.com'
  const COMPILER_URL = 'https://compiler.aepps.com'
  const node = await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL })
  const wallet = await RpcWallet({
    nodes: [{ name: 'test-net', instance: node }],
    compilerUrl: COMPILER_URL,
    accounts: [
      MemoryAccount({ keypair: { secretKey: '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd', publicKey: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ' } }),
    ],
    address: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ',
    name: 'Wallet',
    onConnection (aepp, { accept, deny }) {
        console.log('connected')
    },
    onSubscription (aepp, { accept, deny }) {
    },
    onSign (aepp, { accept, deny, params }) {
    },
    onAskAccounts (aepp, { accept, deny }) {
    },
    onMessageSign (message, { accept }) {
    },
    onDisconnect (message, client) {
    }
  })
  return wallet;
}

// ## Command Line Interface
//
// The `commander` library provides maximum command line parsing convenience.
// program
//   .version('0.1.0')
//   .arguments('<infile> <function> [args...]')
//   .option('-i, --init [state]', 'Arguments to contructor function')
//   .option('-H, --host [hostname]', 'Node to connect to', 'http://localhost:3013')
//   .option('--debug', 'Switch on debugging')
//   .action(exec)
//   .parse(process.argv)

exec()