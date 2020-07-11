const host =  window.location.origin

// let netConfig = {}
//     netConfig.type = "CUSTOM"
//     netConfig.url = "http://localhost:3013"
//     netConfig.minerPrivateKey = "46a010c941c374b3ee7972665fdf8f3bd02602aaa64135a4de458169af310e7f9403ed8e3450183bba8472ea1f0ff073cb18c490c0a65e71c092327cc853e8d2"
//     netConfig.networkId = "ae_privatenet"
//     setCookie("NETWORK_CONFIG", netConfig, 30);
    

selectNetwork = () => {
    /// network : CUSTOM | TESTNET | MAINNET
    /// 
    const network = "CUSTOM";
    let config = {}
    switch(network){
        case "CUSTOM": {
            config.type = "CUSTOM"
            config.url = ""
            config.minerPrivateKey = ""
            config.networkId = ""
            break;
        }
        case "MAINNET": {
            config.type = "MAINNET"
            config.url = ""
            config.minerPrivateKey = ""
            config.networkId = ""
            break;
        }
        case "TESTNET": {
            config.type = "TESTNET"
            config.url = ""
            config.minerPrivateKey = ""
            config.networkId = ""
            break;
        }
    }
    setCookie("NETWORK_CONFIG", config, 30);
}

generateKeyPair = async (params)  => {
    debugger;
    console.log('Account Creator')
    $('.generateKeyPair').buttonLoader('start');

    // let netConfig = {}
    // netConfig.type = "CUSTOM"
    // netConfig.url = "http://localhost:3013"
    // netConfig.channelUrl = "http://localhost:3014"
    // netConfig.minerPrivateKey = "46a010c941c374b3ee7972665fdf8f3bd02602aaa64135a4de458169af310e7f9403ed8e3450183bba8472ea1f0ff073cb18c490c0a65e71c092327cc853e8d2"
    // netConfig.networkId = "ae_privatenet"
    // setCookie("NETWORK_CONFIG", JSON.stringify(netConfig), 30);

    const url = `${host}/api/wallet/account`;
    const resp = await fetch(url);    
    const json = await resp.json();

    // $('.generateKeyPair').buttonLoader('stop');
    setTimeout(function () {
        $('.generateKeyPair').buttonLoader('stop');
        let pubKey = document.getElementById('publicKey')
        pubKey.textContent = json.data.publicKey;

        let secretKey = document.getElementById('secretKey')
        secretKey.textContent = json.data.secretKey;

        let balance = document.getElementById('balance')
        balance.textContent = "0";
    }, 1000);
}

fundAccount = async ()  => {
    $('.fundAccount').buttonLoader('start');
    const publicKey = $('#publicKey').text()
    if(!publicKey){
        alert('Error: No publickey is set. Try Generate Keypair button first')
        $('.fundAccount').buttonLoader('stop');
        return
    }
    const url = `${host}/api/wallet/fund?publicKey=${publicKey}`;
    const resp = await fetch(url);    
    const json = await resp.json();
    setTimeout(function () {
        $('.fundAccount').buttonLoader('stop');
        let balance = document.getElementById('balance')
        balance.textContent = json.data;
    }, 1000);
}

checkBalance = async () => {
    $('.checkBalance').buttonLoader('start');
    const publicKey = $('#publicKey').text()
    if(!publicKey){
        alert('Error: No publickey is set. Try Generate Keypair button first')
        $('.checkBalance').buttonLoader('stop');
        return
    }
    const url = `${host}/api/wallet/balance?publicKey=${publicKey}`;
    const resp = await fetch(url);    
    const json = await resp.json();
    setTimeout(function () {
        $('.checkBalance').buttonLoader('stop');
        let balance = document.getElementById('balance')
        balance.textContent = json.data;
    }, 1000)
}