async function decodeTx() {
  console.log('Decode TX')
  const url = `${host}/decode`;
  $('.decodeTx').buttonLoader('start');

  const body = {
    tx: $('#decode_signedTx').val(),
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
  // $('.generateKeyPair').buttonLoader('stop');
  setTimeout(function () {
    $('.decodeTx').buttonLoader('stop');
    
    if(json && json.status != 200) alert(`Error: ${json.data}`)

    let rawTx = document.getElementById('decode_parsedTx')
    console.log(json.data.parsedTx.tx)
    rawTx.textContent = JSON.stringify(json.data.parsedTx.tx);
  }, 1000);
}