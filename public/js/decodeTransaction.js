async function decodeTx() {
  console.log('Decode TX')
  const url = `${host}/decode`;
  
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

  let rawTx = document.getElementById('decode_parsedTx')
  console.log(json.parsedTx.tx)
  rawTx.textContent = JSON.stringify(json.parsedTx.tx);
}