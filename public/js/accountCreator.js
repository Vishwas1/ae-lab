const host =  window.location.origin

generateKeyPair = async (params)  => {
    console.log('Account Creator')
    $('.generateKeyPair').buttonLoader('start');
    const url = `${host}/account`;
    const resp = await fetch(url);    
    const json = await resp.json();
    
    // $('.generateKeyPair').buttonLoader('stop');
    setTimeout(function () {
        $('.generateKeyPair').buttonLoader('stop');
        let pubKey = document.getElementById('publicKey')
        pubKey.textContent = json.publicKey;

        let secretKey = document.getElementById('secretKey')
        secretKey.textContent = json.secretKey;
    }, 2000);

    
}