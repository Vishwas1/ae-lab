async function signTx() {
  console.log('Sign TX')
  const url = `${host}/sign`;
    $('.signTx').buttonLoader('start');

  const keypair = {
    privateKey: $('#sign_privateKey').val(),
    publicKey : $('#sign_publicKey').val()
  }  
  
  const body = {
      secretKey: keypair.privateKey,
      publicKey: keypair.publicKey,
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
  $('.signTx').buttonLoader('stop');
  if(json && json.status != 200) alert(`Error: ${json.data}`)

  let rawTx = document.getElementById('sign_signedTx')
  rawTx.textContent = json.data.signTx;
  
  checkCookie("privateKey", "sign_privateKey")
  checkCookie("publicKey", "sign_publicKey")
  checkCookie("rawTx", "sign_rawTx")
  checkCookie("signedTx", "sign_signedTx")

  checkCookie("privateKey", "spend_privateKey")
  checkCookie("publicKey", "spend_publicKey")
  checkCookie("rawTx", "spend_rawTx")
  checkCookie("signedTx", "decode_signedTx")

  checkCookie("privateKey", "modal_sign_privateKey")
  checkCookie("publicKey", "modal_sign_publicKey")

}





