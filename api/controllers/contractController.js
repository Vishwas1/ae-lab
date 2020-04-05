const {
    Transaction,
    MemoryAccount,
    ChainNode,
    ContractCompilerAPI,
    Contract,
    Node,
    Ae
  } = require('@aeternity/aepp-sdk')

const {
    statusTypeEnum,
    sendFormattedResponse
} = require('../utils/utils')

const fnTypeEnum = {
    SETTER: 1,
    GETTER: 0
}

/**
 * Private Methods
 **/

const getClient = async (keypair) => {
    const ContractWithAE = await Contract
     .compose(Transaction, MemoryAccount, ChainNode) // AE implementation
     .compose(ContractCompilerAPI) // ContractBase implementation

    const NODE_URL = 'https://sdk-testnet.aepps.com' 
    const NODE_INTERNAL_URL = 'https://sdk-testnet.aepps.com'
    const COMPILER_URL = 'https://compiler.aepps.com'

    // const keypair = {
    //     publicKey: publicKey, //"ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ",
    //     secretKey: secretKey  // "82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd"
    // }

    const node = await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL })    

    // created the client
    const client = await ContractWithAE({ 
        nodes: [{ name: 'testNode', instance: node }],
        compilerUrl: COMPILER_URL, 
        keypair })
    return client;
}


const sanityCheck = (code,keypair) => {
    if(!code) throw new Error("Code is null or empty")
    if(!keypair) throw new Error("Keypair is null or empty")
    if(!keypair.publicKey) throw new Error("publicKey is null or empty")
    if(!keypair.secretKey) throw new Error("secretKey is null or empty")
}

/**
 * Public Methods
 **/

const compileContract = async (req, res) => {
    try{
        const { code, keypair } = req.body;
        sanityCheck(code,keypair);
        const client = await getClient(keypair);
        const compiled = await client.contractCompile(code)
        const data = {
            bytecode : compiled.bytecode
        }
        return sendFormattedResponse(res, data, statusTypeEnum.OK);
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const deployContract = async (req, res) => {
    try{
        const { code, keypair } = req.body;
        sanityCheck(code,keypair);

        const client = await getClient(keypair);
        const cInstance = await client.getContractInstance(code)
        const deployed = await cInstance.deploy([])
        return sendFormattedResponse(res, deployed, statusTypeEnum.OK);
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const callContractMethod = async (req, res) => {
    try{
        const { code, keypair, fn, fnType, args, contractAddress } = req.body;
        sanityCheck(code,keypair);
        if(!fn) throw new Error("Function name is not passed")
        // if(fnType != fnTypeEnum.SETTER || fnType != fnTypeEnum.GETTER) throw new Error("Incorrect function type. It should be either SETTER or GETTER")
        if(!args) throw new Error("Arguments is null or empty")
        if(!Array.isArray(args)) throw new Error("Incorrect argument type. It should be of type Array")
        if(!contractAddress) throw new Error("contractAddress is null or empty")

        const client = await getClient(keypair);
        const cInstance = await client.getContractInstance(code, { contractAddress: contractAddress })
        const options = {} // { amount: 0, fee: 3232, gas: 123}
        let data = {}
        
        const response = await cInstance.call(fn, args, options)
        
        data.hash = response.hash;
        data.gasPrice = response.result.gasPrice
        data.gasUsed = response.result.gasUsed
        data.height = response.result.height
        data.contractId = response.result.contractId
        data.callerPublicKey = response.result.callerId
        data.decodedResult = response.decodedResult
        
        // switch(fnType){
        //     case fnTypeEnum.SETTER: {
        //         data = await (await cInstance.methods[fn].send(args)).decode()
        //         break;
        //     }
        //     case fnTypeEnum.GETTER: {
        //         data = await (await cInstance.methods[fn].get(args)).decode()
        //         break
        //     }
        // }
        return sendFormattedResponse(res, data, statusTypeEnum.OK);
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

const getContractMethods = async (req, res) => {
    try{
        const { code, keypair, contractAddress } = req.body;
        sanityCheck(code,keypair);
        if(!contractAddress) throw new Error("contractAddress is null or empty")

        const client = await getClient(keypair);
        const cInstance = await client.getContractInstance(code, { contractAddress: contractAddress })
        return sendFormattedResponse(res, Object.keys(cInstance.methods), statusTypeEnum.OK);
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

module.exports = {
    compileContract,
    deployContract,
    callContractMethod,
    getContractMethods
}