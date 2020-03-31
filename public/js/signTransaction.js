async function signTx() {
  console.log('Sign TX')
  const url = `${host}/sign`;
  
  const body = {
      secretKey: $('#sign_privateKey').val(),
      publicKey: $('#sign_publicKey').val(),
      rawTx: $('#sign_rawTx').val()
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

  let rawTx = document.getElementById('sign_signedTx')
  rawTx.textContent = json.signTx;
}