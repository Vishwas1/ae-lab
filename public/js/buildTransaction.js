function buildTx(params) {
    console.log('Build TX')
    let sender = document.getElementById('sender')
    sender.textContent = "GCR7TGFGWWMRFQACXFNX7XQ2NNQRA3E7JSBZ44W6KKNOOAZLM7V3N2ZW"

    let reciever = document.getElementById('reciever')
    reciever.textContent = "SDAZYYZ7DBGCPVUZ46OHF3O2YL3FNK3HGXJQNFYPHT5FBE23Z55Z4JOK"

    let amount = document.getElementById('amount')
    amount.textContent = "100"

    let payload = document.getElementById('payload')
    payload.textContent = "SDAZYYZ7DBGCPVUZ46OHF3O2YL3FNK3HGXJQNFYPHT5FBE23Z55Z4JOK"
}