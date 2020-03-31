const host =  window.location.origin

generateKeyPair = async (params)  => {
    console.log('Account Creator')

    const url = `${host}/account`;
    const resp = await fetch(url);    
    const json = await resp.json();
    
    let pubKey = document.getElementById('publicKey')
    pubKey.textContent = json.publicKey;

    let secretKey = document.getElementById('secretKey')
    secretKey.textContent = json.secretKey;
}