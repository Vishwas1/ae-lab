module.exports = {    
    network: {
        dev: {
            url: process.env.TEST_URL || 'http://localhost:3001',
            internalUrl: process.env.TEST_INTERNAL_URL || 'http://localhost:3001',
            channelUrl: process.env.CHANNEL_URL || 'ws://localhost:3001/channel',
            compilerUrl: process.env.COMPILER_URL || '',
            networkId: 'ae_devnet'
        },
        test: {
            type: "TESTNET",
            minerPrivateKey: "",
            url: process.env.TEST_URL || 'https://testnet.aeternity.io',
            internalUrl: process.env.TEST_INTERNAL_URL || 'https://testnet.aeternity.io',
            channelUrl: process.env.CHANNEL_URL || 'wss://testnet.aeternity.io:443/channel',
            compilerUrl: process.env.COMPILER_URL || 'https://compiler.aepps.com',
            networkId: 'ae_uat'
        },
        prod: {

        }
    }
}