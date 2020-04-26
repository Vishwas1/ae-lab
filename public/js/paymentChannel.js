const WTYPE = Object.freeze({
    WALLET1: 'wallet1',
    WALLET2: 'wallet2' 
})

async function connectChannel(wallet){
    let initiatorDeposit;
    let responderDeposite;
    let initiatorPublicKey;
    let responderPublicKey;
    let keypair;
    const url = `${host}/connect`;
    console.log(wallet)
    switch(wallet){
        case WTYPE.WALLET1: {
            $('.connectChannel').buttonLoader('start');
            initiatorDeposit = $('#pc_w1_deposit').val()
            responderDeposite = $('#pc_w2_deposit').val()
            initiatorPublicKey = $('#pc_w1_publicKey').val()
            responderPublicKey = $('#pc_w2_publicKey').val()
            keypair = {
                secretKey: $('#pc_w1_privateKey').val(),
                publicKey: $('#pc_w1_publicKey').val()
            }
            break
        }
        // case WTYPE.WALLET2: {
        //     $('.connectChannel2').buttonLoader('start');
        //     initiatorDeposit = $('#pc_w2_deposit').val()
        //     responderDeposite = $('#pc_w1_deposit').val()
        //     initiatorPublicKey = $('#pc_w2_publicKey').val()
        //     responderPublicKey = $('#pc_w1_publicKey').val()
        //     keypair = {
        //         secretKey: $('#pc_w2_privateKey').val(),
        //         publicKey: $('#pc_w2_publicKey').val()
        //     }
        //     break
        // }
    }
   
    const body =  {
            initiatorPublicKey: initiatorPublicKey, 
            responderPublicKey: responderPublicKey, 
            initiatorAmount: initiatorDeposit == ""? 0 : initiatorDeposit, 
            responderAmount: responderDeposite == "" ? 0 : responderDeposite, 
            keypair: keypair
        }
    console.log(body)
    const resp =  await fetch(url, {
        method : 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
    const json = await resp.json();
    if (wallet == WTYPE.WALLET1)
        $('.connectChannel1').buttonLoader('stop');
    // else
    //     $('.connectChannel2').buttonLoader('stop');    
    if(json && json.status != 200) alert(`Error: ${json.data}`)

    console.log(json)
    $('#channelId').val(json.data.channelId)
}

async function setupChannel(wallet){
    let initiatorDeposit;
    let responderDeposite;
    let initiatorPublicKey;
    let responderPublicKey;
    let keypair;
    const url = `${host}/setup`;
    console.log(wallet)
    switch(wallet){
        case WTYPE.WALLET1: {
            $('.setupChannel1').buttonLoader('start');
            initiatorDeposit = $('#pc_w2_deposit').val()
            responderDeposite = $('#pc_w1_deposit').val()
            initiatorPublicKey = $('#pc_w2_publicKey').val()
            responderPublicKey = $('#pc_w1_publicKey').val()
            keypair = {
                secretKey: $('#pc_w1_privateKey').val(),
                publicKey: $('#pc_w1_publicKey').val()
            }
            break
        }
        // case WTYPE.WALLET2: {
        //     $('.setupChannel2').buttonLoader('start');
        //     initiatorDeposit = $('#pc_w1_deposit').val()
        //     responderDeposite = $('#pc_w2_deposit').val()
        //     initiatorPublicKey = $('#pc_w1_publicKey').val()
        //     responderPublicKey = $('#pc_w2_publicKey').val()
        //     keypair = {
        //         secretKey: $('#pc_w2_privateKey').val(),
        //         publicKey: $('#pc_w2_publicKey').val()
        //     }
        //     break
        // }
    }

    const body =  {
            initiatorPublicKey: initiatorPublicKey, 
            responderPublicKey: responderPublicKey, 
            initiatorAmount: initiatorDeposit == ""? 0 : initiatorDeposit, 
            responderAmount: responderDeposite == "" ? 0 : responderDeposite, 
            keypair: keypair
        }
    
    console.log(body)
    
    const resp =  await fetch(url, {
        method : 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    })
    const json = await resp.json();
    if (wallet == WTYPE.WALLET1)
        $('.setupChannel1').buttonLoader('stop');
    // else
    //     $('.setupChannel2').buttonLoader('stop');    
    if(json && json.status != 200) alert(`Error: ${json.data}`)
    console.log(json)
    $('#channelId').val(json.data.channelId)
}

async function leaveChannel(wallet){
    const url = `${host}/leave`;
    let channelId = $('#channelId').val();
    let publicKey;
    switch(wallet){
        case WTYPE.WALLET1: {
            $('.leaveChannel1').buttonLoader('start');
            publicKey = $('#pc_w1_publicKey').val()
            break
        }
        // case WTYPE.WALLET2: {
        //     $('.leaveChannel2').buttonLoader('start');
        //     publicKey = $('#pc_w2_publicKey').val()
        //     break
        // }
    }

    const body =  {
        channelId: channelId, 
        publicKey: publicKey, 
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
    if (wallet == WTYPE.WALLET1)
        $('.leaveChannel1').buttonLoader('stop');
    // else
    //     $('.leaveChannel2').buttonLoader('stop');    
    if(json && json.status != 200) alert(`Error: ${json.data}`)

    alert(json.data)
}

async function reconnectChannel(wallet){
    const url = `${host}/reconnect`;
    let channelId = $('#channelId').val();
    let keypair;
    switch(wallet){
        case WTYPE.WALLET1: {
            $('.reconnectChannel1').buttonLoader('start');
            keypair = {
                secretKey: $('#pc_w1_privateKey').val(),
                publicKey: $('#pc_w1_publicKey').val()
            }
            break
        }
        // case WTYPE.WALLET2: {
        //     $('.reconnectChannel2').buttonLoader('start');
        //     keypair = {
        //         secretKey: $('#pc_w2_privateKey').val(),
        //         publicKey: $('#pc_w2_publicKey').val()
        //     }
        //     break
        // }
    }

    const body =  {
        channelId: channelId, 
        keypair: keypair, 
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
    if (wallet == WTYPE.WALLET1)
        $('.reconnectChannel1').buttonLoader('stop');
    // else
    //     $('.reconnectChannel2').buttonLoader('stop');    
    if(json && json.status != 200) alert(`Error: ${json.data}`)

    json.data == true ?  alert('Reconnected!') : alert('Error: Could not reconnect!')

}

async function spendOffChain(wallet){
    const url = `${host}/offspend`;
    let channelId = $('#channelId').val();
    let keypair;
    let amount;
    let receiverPublicKey;
    switch(wallet){
        case WTYPE.WALLET1: {
            $('.spendOffChain1').buttonLoader('start');
            keypair = {
                secretKey: $('#pc_w1_privateKey').val(),
                publicKey: $('#pc_w1_publicKey').val()
            }
            amount = $('#pc_w1_amount').val()
            receiverPublicKey = $('#pc_w2_publicKey').val()
            break
        }
        // case WTYPE.WALLET2: {
        //     $('.spendOffChain2').buttonLoader('start');
        //     keypair = {
        //         secretKey: $('#pc_w2_privateKey').val(),
        //         publicKey: $('#pc_w2_publicKey').val()
        //     }
        //     amount = $('#pc_w2_amount').val()
        //     receiverPublicKey = $('#pc_w1_publicKey').val()
        //     break
        // }
    }
    const body = {
        keypair: keypair,
        channelId: channelId,
        amount: amount,
        receiverPublicKey: receiverPublicKey,
        memo: "Sending money to the shop keeper"
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
    if (wallet == WTYPE.WALLET1)
        $('.spendOffChain1').buttonLoader('stop');
    // else
    //     $('.spendOffChain2').buttonLoader('stop');    
    if(json && json.status != 200) alert(`Error: ${json.data}`)

    const {result , status } = json.data
    const { balances, state  } = status
    const l = result.signedTx.length
    
    const tableRowData = {
        signedTx: shortenStr(result.signedTx),
        spender: shortenStr(body.keypair.publicKey),
        beneficiary: shortenStr(body.receiverPublicKey),
        spenderbal: balances[body.keypair.publicKey],
        beneficiarybal: balances[receiverPublicKey],
        round: state.round
    }

    const tr = `<tr>
                <td>${tableRowData.signedTx}</td>
                <td>${tableRowData.round}</td>
                <td>${tableRowData.spender}</td>
                <td>${tableRowData.beneficiary}</td>
                <td>${tableRowData.spenderbal}</td>
                <td>${tableRowData.beneficiarybal}</td>
                </tr>`

    const tbody = $('.table-bordered tbody')
    tbody.append(tr);
}

const shortenStr = (str) => {
    const l = str.length
    return str.substring(0, 10) + '...' + str.substring(l-5,l)
}
