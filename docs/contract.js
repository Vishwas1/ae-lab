const { Universal: Ae, Node } = require('@aeternity/aepp-sdk')
const program = require('commander') // solution for node.js command-line interfaces [https://github.com/tj/commander.js#readme]
const compilerUrl = process.env.COMPILER_URL || 'https://compiler.aepps.com'


const getSdkInstane = async () => {
  const node = await Node({ url: compilerUrl })
  return await Ae({ debug: program.debug,  // in debug mode
    process,  // 
    nodes: [{ name: 'testNode', instance: node }] 
  })
}

const compile = async (code) => {
  try{
    const sdkInstance = await getSdkInstane();
    const bytecodeInst = await sdkInstance.contractCompile(code) // pass the raw code
    const result = {
      bytecodeInstance : bytecodeInst,
      bytecode : bytecodeInst.bytecode
    }
    console.log(`Code is compiled into bytecode  =  ${result.bytecode}`)
    return result
  }catch(e){
    console.log(e)
  }
  
}


const deploy = async (bytecodeInstance) => {
  console.log(`Obtained bytecode ${bytecodeInstance.bytecode}`)
  const deployedInstance = await bytecodeInstance.deploy({ initState: program.init })
  const result = {
    deployed : deployedInstance,
    contractAddress: deployedInstance.address
  }
  return result
}

const call = async (fn, deployedInstance) => {
  const value = await deployedInstance.call(fn, { args: args.join(' ') })
  console.log(`Execution result: ${value}`)
}


// const code = "contract CryptoHamster =\n datatype event = NewHamster(indexed int, string, hash)\n\n record state = { hamsters : map(string, hash), next_id : int }\n\n stateful entrypoint init() = { hamsters = {}, next_id = 0 }\n\n entrypoint nameExists(name: string) : bool =\n Map.member(name, state.hamsters)\n\n stateful entrypoint createHamster(hamsterName: string) =\n require(!nameExists(hamsterName), \"Name is already taken\")\n createHamsterByNameDNA(hamsterName, generateDNA(hamsterName))\n \n entrypoint getHamsterDNA(hamsterName: string) : hash =\n require(nameExists(hamsterName), \"Hamster does not exist!\")\n state.hamsters[hamsterName]\n\n stateful function createHamsterByNameDNA(name: string, dna: hash) =\n put(state{hamsters[name] = dna, next_id = (state.next_id + 1)})\n Chain.event(NewHamster(state.next_id, name, dna))\n \n function generateDNA(name : string) : hash =\n String.sha3(name)" // raw Sophia contract in string form

// compile(code)
const code = "contract CryptoHamster =\n datatype event = NewHamster(indexed int, string, hash)\n\n record state = { hamsters : map(string, hash), next_id : int }\n\n stateful entrypoint init() = { hamsters = {}, next_id = 0 }\n\n entrypoint nameExists(name: string) : bool =\n Map.member(name, state.hamsters)\n\n stateful entrypoint createHamster(hamsterName: string) =\n require(!nameExists(hamsterName), \"Name is already taken\")\n createHamsterByNameDNA(hamsterName, generateDNA(hamsterName))\n \n entrypoint getHamsterDNA(hamsterName: string) : hash =\n require(nameExists(hamsterName), \"Hamster does not exist!\")\n state.hamsters[hamsterName]\n\n stateful function createHamsterByNameDNA(name: string, dna: hash) =\n put(state{hamsters[name] = dna, next_id = (state.next_id + 1)})\n Chain.event(NewHamster(state.next_id, name, dna))\n \n function generateDNA(name : string) : hash =\n String.sha3(name)" // raw Sophia contract in string form
const internalUrl = process.env.TEST_INTERNAL_URL || 'https://sdk-testnet.aepps.com'
const  meth = async () => {
  console.log(1)
  // const node = await Node({ url: 'https://sdk-testnet.aepps.com', internalUrl: internalUrl })
  const node = await Node({ url: 'https://compiler.aepps.com' })
  console.log(2)

  Ae({
    nodes: [{ name: 'testNode', instance: node }] ,
    compilerUrl: 'https://compiler.aepps.com',
    accounts: [
      MemoryAccount({ keypair: { secretKey: '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd', publicKey: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ' } }),
    ],
    address: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ',
    networkId: 'ae_uat' // or any other networkId your client should connect to
})

  // Ae({ debug: program.debug,  // in debug mode
  //     process,  // 
  //     nodes: [{ name: 'testNode', instance: node }] 
  //   })
    .then(ae => {
      console.log(3)
      console.log(ae)
      return ae.contractCompile(code) // pass the raw code
    })
    .then(bytecode => {
      console.log(`Obtained bytecode ${bytecode.bytecode}`)
      // Invoking `deploy` on the bytecode object will result in the 
      // contract being written to the chain, once the block has been mined.
      return 1 //bytecode.deploy({ initState: program.init }) 
    })
  
}

meth()
