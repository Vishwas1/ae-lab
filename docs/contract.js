// const { Contract } = require('@aeternity/aepp-sdk')


// or using bundle
const {
  Transaction,
  MemoryAccount,
  ChainNode,
  ContractCompilerAPI,
  Contract,
  Node,
  Ae,
  TxBuilder
} = require('@aeternity/aepp-sdk')


const code = "contract CryptoHamster =\n   datatype event = NewHamster(indexed int, string, hash)\n\n   record state = { hamsters : map(string, hash), next_id : int }\n\n   stateful entrypoint init() = { hamsters = {}, next_id = 0 }\n\n   entrypoint nameExists(name: string) : bool =\n      Map.member(name, state.hamsters)\n\n   stateful entrypoint createHamster(hamsterName: string) =\n      require(!nameExists(hamsterName), \"Name is already taken\")\n      createHamsterByNameDNA(hamsterName, generateDNA(hamsterName))\n   \n   entrypoint getHamsterDNA(hamsterName: string) : hash =\n      require(nameExists(hamsterName), \"Hamster does not exist!\")\n      state.hamsters[hamsterName]\n\n   stateful function createHamsterByNameDNA(name: string, dna: hash) =\n      put(state{hamsters[name] = dna, next_id = (state.next_id + 1)})\n      Chain.event(NewHamster(state.next_id, name, dna))\n \n   function generateDNA(name : string) : hash =\n      String.sha3(name)"
// const code = `
// contract StateContract =
//   record state = { value: string }
//   entrypoint init(value) : state = { value = value }
//   entrypoint retrieve() : string = state.value
// `

const getInstance = async () => {
  const ContractWithAE = await Contract
   .compose(Transaction, MemoryAccount, ChainNode) // AE implementation
   .compose(ContractCompilerAPI) // ContractBase implementation

  const NODE_URL = 'https://sdk-testnet.aepps.com' 
  const NODE_INTERNAL_URL = 'https://sdk-testnet.aepps.com'
  const COMPILER_URL = 'https://compiler.aepps.com'
  const keypair = {
      publicKey: "ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ",
      secretKey: "82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd"
  }

  const node = await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL })
  
  // created the client
  const client = await ContractWithAE({ 
      nodes: [{ name: 'testNode', instance: node }],
      compilerUrl: COMPILER_URL, 
      keypair })
  return client;
}
const exec = async () => {

  const client = await getInstance();
  const compiled = await client.contractCompile(code)
  console.log(compiled.bytecode)

  
  // // console.log(deployed)

  // const result = await deployed.call('createHamster', ['"hello"'])
  // console.log('----------------------------------------------------------')
  // console.log(result)
  // console.log(`Transaction Hash       : ${result.hash}`)
  // console.log(`Contract address       : ${result.result.contractId}`)
  // console.log(`Return Value           : ${result.result.returnValue}`)
  // console.log(`Return Type            : ${result.result.returnType}`)
  // console.log(`CallData               : ${result.txData.tx.callData}`)
  // console.log(`Contract address       : ${result.txData.tx.contractId}`)
  // console.log(`Fee                    : ${result.txData.tx.fee}`)
  // console.log(`Gas                    : ${result.txData.tx.gas}`)

  // console.log(await result.decode())


  
}

// exec();

/**
* ----------------------------------------------------------
Transaction Hash       : th_2Wn7j5tBLkqNE8N6oT3EjTpEayp8YQVVqPgvu9LygCcpw8RQgA
Contract address       : ct_tHn4D9TAEiZsdAYzwgexiqDqvBLfR9er6u5Trb6fr7kEmwRyk
Return Value           : cb_P4fvHVw=
Return Type            : ok
CallData               : cb_KxGtD0GrGxVoZWxsb3kGahA=
Contract address       : ct_tHn4D9TAEiZsdAYzwgexiqDqvBLfR9er6u5Trb6fr7kEmwRyk
Fee                    : 182120000000000
Gas                    : 1579000
*/

const callmethod = async () => {
  const bytecode = "cb_+QIWRgOgaZTB0mG7/ik4B+opAyHkb/GUOSCk/18vmOFKy1XzTujAuQHouQFC/h+WplkCNwF3l0AbBAAA/kTWRB8ANwA3ACoADAMAJwwEDwKCAQM//mWl4A8CNwGHATcDB3eXQDcARjYAAABGNgIAAkY2BAAEY64CnwGB1A8INhTetTsuPWg3aYs3Gx2F1YS+pAgTA794KdCGtDoABAEDP/5oEVXIADcBdxcoLACCLxAAAP6AfKC/AjcCd5dANwAaCgCCKC4CAAAtWAIAAigsAoIQJwwEDwKCKCwCggwBAAwBAkT8EwYABgQDEWWl4A/+p+HhwQA3AXeXQAwBAAIDEWgRVcgHDAb7A11IYW1zdGVyIGRvZXMgbm90IGV4aXN0ISgsAIIrEAAA/q0PQasANwF3NwAMAQACAxFoEVXIJgAHDAb7A1VOYW1lIGlzIGFscmVhZHkgdGFrZW4MAQACAxEflqZZDAEABAMRgHygv7ieLwcRH5amWWkuQ3J5cHRvSGFtc3Rlci5nZW5lcmF0ZUROQRFE1kQfEWluaXQRZaXgDy1DaGFpbi5ldmVudBFoEVXIKW5hbWVFeGlzdHMRgHygv5UuQ3J5cHRvSGFtc3Rlci5jcmVhdGVIYW1zdGVyQnlOYW1lRE5BEafh4cE1Z2V0SGFtc3RlckROQRGtD0GrNWNyZWF0ZUhhbXN0ZXKCLwCFNC4xLjAA02G+yw=="    
  const hash = "tx_+LILAfhCuEALLSnh0am93zm5X53+tfM4jFCnsj4l/4pPozyynivUlginXPWD3bR4FWK/gNKChawBGzzLkqPEnw50O4zDJ+IFuGr4aCsBoQFmsD+B/Z6uaNTbsaMhsfhdB/F4NM2gkM/pwO4NN9kT3RWhBZvJbXQA36VwKQH8pzLQoWpIg77/vxV/pHTUB4QlzSPDA4alox3oEAAAAIMYF/iEO5rKAI0rEa0PQasbFWhlbGxvM3KAQQ==";
  const contractAddress = "ct_tHn4D9TAEiZsdAYzwgexiqDqvBLfR9er6u5Trb6fr7kEmwRyk"
  const client = await getInstance();


  
  //
  {
      // const cInstance = await client.getContractInstance(code, { contractAddress: contractAddress, opt: { ttl: 0 }})

      const cInstance = await client.getContractInstance(code)

      const deployed = await cInstance.deploy([])
      console.log(deployed)

      
      console.log(cInstance.methods)
      console.log(await (await cInstance.methods.createHamster.send('Vishwas')).decode()) 
      console.log(await (await cInstance.methods.nameExists.get('hello')).decode())
      console.log(await (await cInstance.methods.nameExists.get('Vishwas')).decode())
      console.log(await (await cInstance.methods.nameExists.get('Anand')).decode())
      

      // const decodedCallData = await result.decode()
      // console.log(decodedCallData)
  }    
}

// callmethod();  


const callContractUsingAddress = async () => {
  const contractAddress = "ct_tHn4D9TAEiZsdAYzwgexiqDqvBLfR9er6u5Trb6fr7kEmwRyk"
  const client = await getInstance();


  {
      const contract = await client.getContract(contractAddress)// await client.getContractInstance({ contractAddress: contractAddress })
      console.log(contract)
      const cByteCode = await client.getContractByteCode(contractAddress)
      // console.log(cByteCode)

      
      const cInstance = await client.getContractInstance(code, { contractAddress: contractAddress })
      // const cInstance = await TxBuilder.unpackTx(cByteCode.bytecode, false, 'cb')
      console.log(cInstance.methods)

      
      // const res = await cInstance.call('nameExists', ["hello"], {})
      // const res1 = await (await cInstance.call('createHamster', ["vishwas1"], {})).decode()
      // const res2 = await (await cInstance.call('getHamsterDNA', ["vishwas"], {})).decode()
      const res3 = await cInstance.call('getHamsterDNA', ["vishwas"], {})
      const res4 =await (await cInstance.call('getHamsterDNA', ["vishwas1"], {})).decode()
      console.log(res3.decodedResult)
      console.log(res4)
      
      
      // console.log(cInstance.tx.sourceCodeHash.toString('utf8'))
      // console.log(cInstance.binary[4].toString('utf8'))
      //JSON.stringify(cInstance.tx.sourceCodeHash))
  }
}

callContractUsingAddress();

// check account
//https://sdk-testnet.aepps.com/v2/accounts/ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ
//{"balance":4997659378000000000,"id":"ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ","kind":"basic","nonce":19,"payable":true}