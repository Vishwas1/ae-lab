
async function submitTx(params) {
    console.log('Spend TX')
    $('.submitTx').buttonLoader('start');

    const url = `${host}/api/wallet/spend`;
    
    const body = {
        secretKey: $('#spend_privateKey').val(),
        publicKey: $('#spend_publicKey').val(),
        rawTx: $('#spend_rawTx').val(),
        verify: $('#spend_verify').is(":checked"), 
        waitMined: $('#spend_waitMining').is(":checked")
    }

    const resp =  await fetch(url, {
        method : 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
    const json = await resp.json();
    $('.submitTx').buttonLoader('stop');
    if(json && json.status != 200) return alert(`Error: ${json.data}`)

    let rawTx = document.getElementById('spend_result')
    console.log(json.data)
    rawTx.textContent = JSON.stringify(json.data);
    
}