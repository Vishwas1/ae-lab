const host =  window.location.origin

// let netConfig = {}
//     netConfig.type = "CUSTOM"
//     netConfig.url = "http://localhost:3013"
//     netConfig.minerPrivateKey = "46a010c941c374b3ee7972665fdf8f3bd02602aaa64135a4de458169af310e7f9403ed8e3450183bba8472ea1f0ff073cb18c490c0a65e71c092327cc853e8d2"
//     netConfig.networkId = "ae_privatenet"
//     setCookie("NETWORK_CONFIG", netConfig, 30);
    
function selectNetwork(network){
    debugger
    /// network : CUSTOM | TESTNET | MAINNET
    /// 
    let config = {}
    config.type = "TESTNET"
    config.url = "https://testnet.aeternity.io"
    config.channelUrl = "https://testnet.aeternity.io"
    config.compilerUrl = "https://compiler.aepps.com"
    config.minerPrivateKey = ""
    config.networkId = "ae_uat"
    switch(network){
        case "CUSTOM": {
            config.url = $('#setnet_nodeurl').val()
            config.compilerUrl = $('#setnet_comurl').val()
            config.channelUrl = $('#setnet_churl').val() 
            config.minerPrivateKey = $('#setnet_minerkey').val()
            config.networkId = $('#setnet_networkId').val() 
            config.type = "CUSTOM"
            if(config.url == "" || config.compilerUrl == "" ||
                config.channelUrl == "" || 
                config.minerPrivateKey == "" || 
                config.networkId == ""){
                    alert('Error: Custom network can not be set. Please pass all params')
                    return
                }
            $('.networkButtonCustom').removeClass('btn-secondary')
            $('.networkButtonCustom').addClass('btn-primary')
            $('.networkButtonTest').removeClass('btn-primary')
            $('.networkButtonTest').removeClass('btn-secondary')
            break;
        }
        case "MAINNET": {}
        case "TESTNET": {
            $('.networkButtonTest').addClass('btn-primary')
            $('.networkButtonTest').removeClass('btn-secondary')
            $('.networkButtonCustom').removeClass('btn-primary')
            $('.networkButtonCustom').addClass('btn-secondary')
            alert(`${config.type} network is selected! \n\n ${JSON.stringify(config)}`)
            break
        }
    }
    setCookie("NETWORK_CONFIG", JSON.stringify(config), 30);
    
}

generateKeyPair = async (params)  => {
    debugger;
    console.log('Account Creator')
    $('.generateKeyPair').buttonLoader('start');

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