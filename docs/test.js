#!/usr/bin/env node
// # Simple Sophia Contract Compiler
//
// This script demonstrates how to deal with the different phases of compiling
// Sophia contracts to bytecode, deploying the bytecode to get a callable
// contract address and ultimately, invoke the deployed contract on the
// æternity blockchain.
/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

'use strict'

// We'll need the main client module `Ae` in the `Universal` flavor from the SDK.
const { Universal: Ae, Node, RpcAepp, MemoryAccount, Wallet, RpcWallet, Universal } = require('@aeternity/aepp-sdk')
const program = require('commander')
// const fs = require('fs')

async function exec (infile, fn, args) {
  // if (!infile || !fn) {
  //   program.outputHelp()
  //   process.exit(1)
  // }

  const code = "contract CryptoHamster =\n   datatype event = NewHamster(indexed int, string, hash)\n\n   record state = { hamsters : map(string, hash), next_id : int }\n\n   stateful entrypoint init() = { hamsters = {}, next_id = 0 }\n\n   entrypoint nameExists(name: string) : bool =\n      Map.member(name, state.hamsters)\n\n   stateful entrypoint createHamster(hamsterName: string) =\n      require(!nameExists(hamsterName), \"Name is already taken\")\n      createHamsterByNameDNA(hamsterName, generateDNA(hamsterName))\n   \n   entrypoint getHamsterDNA(hamsterName: string) : hash =\n      require(nameExists(hamsterName), \"Hamster does not exist!\")\n      state.hamsters[hamsterName]\n\n   stateful function createHamsterByNameDNA(name: string, dna: hash) =\n      put(state{hamsters[name] = dna, next_id = (state.next_id + 1)})\n      Chain.event(NewHamster(state.next_id, name, dna))\n \n   function generateDNA(name : string) : hash =\n      String.sha3(name)"

  const NODE_URL = 'https://sdk-testnet.aepps.com' 
  const NODE_INTERNAL_URL = 'https://sdk-testnet.aepps.com'
  const COMPILER_URL = 'https://compiler.aepps.com'

  const node = await Node({ url: NODE_URL, internalUrl: NODE_INTERNAL_URL })
  process.env.WALLET_PRIV = '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd'
  process.env.WALLET_PUB = 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ'
  
  const client = await Ae({
    debug: true, 
    process,
    name: 'AEPP',
    nodes: [{ name: 'test-net', instance: node }],
    compilerUrl: COMPILER_URL
  })
  
  let compileBytecodeResponse = await client.contractCompile(code)
  console.log(`The code is complied, bytecode = ${compileBytecodeResponse.bytecode}`)
  
  
  const deployedInstance = await compileBytecodeResponse.deploy({ initState: [] })
  
  console.log(`Deployed at address = ${deployedInstance.addresses}`)
  // await client.disconnectWallet()
}

const getWallet  =  async () => {
  
// const walletInstance = await Wallet({
  //   nodes: [{ name: 'test-net', instance: node }],    
  //   compilerUrl: COMPILER_URL,
  //   name: 'Wallet',
  //   accounts: [
  //     MemoryAccount({ keypair: { secretKey: '82716111c60707bf769ca960091efa1cd250f36d5396d3b6604e49c71142756166b03f81fd9eae68d4dbb1a321b1f85d07f17834cda090cfe9c0ee0d37d913dd', publicKey: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ' } }),
  //   ],
  //   address: 'ak_nE3GbfpQWgJ1ffDyM9rd4mcztt9jREjqumuiBGvpgRbDYnJrQ',
  // })
  // compileBytecodeResponse = await walletInstance.contractCompile(code)
  // console.log(`The code is complied, bytecode = ${compileBytecodeResponse.bytecode}`)
  
// return
  // const connection = await walletInstance.getConnection()
  // console.log(connection)

  // await client.connectToWallet(connection)

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