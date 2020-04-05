Ref: 

- https://github.com/aeternity/aepp-sdk-js/blob/develop/docs/examples/node/aecontract.md
- https://github.com/aeternity/aepp-sdk-js/blob/develop/examples/node/aecontract.js 

converting Sophia contracts to bytecode


```js
const { Universal: Ae, Node } = require('@aeternity/aepp-sdk')
const program = require('commander') // solution for node.js command-line interfaces [https://github.com/tj/commander.js#readme]

const compilerUrl = process.env.COMPILER_URL || 'https://compiler.aepps.com'
const node = await Node({ url: compilerUrl })

 //  raw Sophia contract in string form and sends it off to the node for bytecode compilation. This might in the future be done without talking to the node, but requires a bytecode compiler implementation directly in the SDK.
const code = "contract CryptoHamster =\n datatype event = NewHamster(indexed int, string, hash)\n\n record state = { hamsters : map(string, hash), next_id : int }\n\n stateful entrypoint init() = { hamsters = {}, next_id = 0 }\n\n entrypoint nameExists(name: string) : bool =\n Map.member(name, state.hamsters)\n\n stateful entrypoint createHamster(hamsterName: string) =\n require(!nameExists(hamsterName), \"Name is already taken\")\n createHamsterByNameDNA(hamsterName, generateDNA(hamsterName))\n \n entrypoint getHamsterDNA(hamsterName: string) : hash =\n require(nameExists(hamsterName), \"Hamster does not exist!\")\n state.hamsters[hamsterName]\n\n stateful function createHamsterByNameDNA(name: string, dna: hash) =\n put(state{hamsters[name] = dna, next_id = (state.next_id + 1)})\n Chain.event(NewHamster(state.next_id, name, dna))\n \n function generateDNA(name : string) : hash =\n String.sha3(name)" // raw Sophia contract in string form

Ae({ debug: program.debug,  // in debug mode
    process,  // 
    nodes: [{ name: 'testNode', instance: node }] 
  })
  .then(ae => {
    return ae.contractCompile(code) // pass the raw code
  })
  .then(bytecode => {
    console.log(`Obtained bytecode ${bytecode.bytecode}`)
    // Invoking `deploy` on the bytecode object will result in the 
    // contract being written to the chain, once the block has been mined.
    return bytecode.deploy({ initState: program.init }) 
  })
  .then(deployed => {
    console.log(`Contract deployed at ${deployed.address}`)
    // Once the contract has been successfully mined, we can attempt to invoke
    // any public function defined within it. 
    return deployed.call(fn, { args: args.join(' ') })
  }).then(value => {
    // The execution result, if successful, will be an AEVM-encoded result value.
    console.log(`Execution result: ${value}`)
  }).catch(e => console.log(e.message))

```