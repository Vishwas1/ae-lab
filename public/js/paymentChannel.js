// $(function () {
const WTYPE = Object.freeze({
    WALLET1: 'wallet1',
    WALLET2: 'wallet2'
})

const mTypes = Object.freeze({
    LISTUSER: 'list-channel-users',
    ADDUSER: 'add-channel-user',
    ERROR: 'error',
    TRANSACTION: 'transaction',
    ACCEPT: 'channel-accept',
    REJECT: 'channel-reject',
    INITIATE: 'channel-initiate',
    CLOSE: 'channel-close'
})

window.WebSocket = window.WebSocket || window.MozWebSocket;

if (!window.WebSocket) {
    console.log(`Sorry, but your browser doesn\'t support WebSocket.`)
    alert(`Sorry, but your browser doesn\'t support WebSocket.`)
    // return 
}

const wsurl = window.location.protocol === "https:" ? `wss://${window.location.host}` : `ws://${window.location.host}`
var connection = new WebSocket(wsurl);
connection.onopen = function () {
    console.log('WS:: Connected!')
}

connection.onerror = function (error) {
    const msg = 'Sorry, but there\'s some problem with your connection or the server is down.'
    console.log('WS:: ', msg)
    alert(msg);
}

connection.onmessage = function (message) {
    console.log('WS:: Received a message = ', message)
    let json;
    try {
        json = JSON.parse(message.data);
    } catch (e) {
        console.log('WS:: Invalid JSON: ', message.data);
        return;
    }

    if (!json.type) return
    switch (json.type) {
        case mTypes.LISTUSER: {
            console.log('WS:: New user added ', json.data)
            const option = `<option>${json.data.publicKey} | ${json.data.alias} </option>`
            $('#pc_w2_publicKey').append(option)
            collapsePanelActivity('pc_setupChannel', 'in')
            toast('Peer connected')
            break
        }

        case mTypes.TRANSACTION: {
            console.log('WS:: New transaction added ', json.data)
            appendTx(json.data)
            toast('New transaction')
            break
        }
        case mTypes.CLOSE: {
            console.log('WS:: Channel is clsed ', json.data)


        }
        case mTypes.ACCEPT: {
            console.log('WS:: New channel accept message came ', json.data)
            const body = {
                init: json.data
            }
            fillDataIntoStatusModal(body)
            $('#channelAcceptTxtArea').val(JSON.stringify(json.data))
            $('.connectChannel1').attr('hidden')
            collapsePanelActivity('pc_channelStatus','in')
            toast('Channel request came')
            break
        }
    }
}

const toast = (message) => {

    const toast = `<div class="toast"><i class="fa fa-info" aria-hidden="true"> ${message}</i><span class="spanclose">x</span></div>`

    $('.notificationbar').append(toast)
}

const collapsePanelActivity = (id, action) => {
    $(`#${id} .panel-collapse`).removeClass(`${action}`)
    $(`#${id} .panel-collapse`).addClass(`${action}`)
}

const fillDataIntoStatusModal = (body) => {
    const { init, status } = body
    if (init) {

        $('#modal_initiator').text(init.initiatorPublicKey)
        $('#modal_responder').text(init.responderPublicKey)
        $('#modal_initiator_deposit').text(init.initiatorAmount)
        $('#modal_responder_deposit').text(init.responderAmount)
    }


    if (status) {
        $('#modal_channelId').text(status.channelId)
        $('#modal_fsmId').text(status.fsmId)
        $('#modal_round').text(status.round)
        $('#modal_initiator_balance').text(status.initiatorbalance)
        $('#modal_responder_balance').text(status.responderbalance)
    }

}

function notify(message) {
    connection.send(JSON.stringify(message));
}

function saveUser() {
    $('.saveWallet1').buttonLoader('start');
    setTimeout(async () => {
        const msg = {
            type: mTypes.ADDUSER,
            body: {
                alias: $('#pc_w1_alias').val(),
                publicKey: $('#pc_w1_publicKey').val()
            }
        }
        console.log('Saving this new user ', msg)
        notify(msg)
        $('.saveWallet1').buttonLoader('stop')
        collapsePanelActivity('pc_setupChannel','in')

        $('#pc_w1_alias').hide()
        $('#alias_lbl').text(msg.body.alias)
        await updateBalance()

    }, 2000)
}

async function connectChannel(wallet) {
    try {
        let initiatorDeposit;
        let responderDeposite;
        let initiatorPublicKey;
        let responderPublicKey;
        let keypair;
        const url = `${host}/connect`;
        console.log(wallet)
        switch (wallet) {
            case WTYPE.WALLET1: {
                $('.connectChannel1').buttonLoader('start');
                initiatorDeposit = $('#modal_initiator_deposit').text()
                responderDeposite = $('#modal_responder_deposit').text()
                initiatorPublicKey = $('#pc_w1_publicKey').val()
                responderPublicKey = $('#modal_responder').text()
                keypair = {
                    secretKey: $('#pc_w1_privateKey').val(),
                    publicKey: $('#pc_w1_publicKey').val()
                }
                break
            }
        }

        const body = JSON.parse($('#channelAcceptTxtArea').val())
        body.keypair = keypair

        console.log(body)
        const resp = await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const json = await resp.json();

        $('.connectChannel1').buttonLoader('stop');
        $('.connectChannel1').removeAttr('hidden')

        if (json && json.status != 200) throw new Error(json.data)

        console.log(json)
        $('#modal_channelId').text(json.data.channelId)
        await channelStatus(body)
    } catch (e) {
        $('.connectChannel1').buttonLoader('stop');
        alert(`Error: ${e.toString()}`)
    }
}

async function setupChannel(wallet) {
    try {
        let initiatorDeposit;
        let responderDeposite;
        let initiatorPublicKey;
        let responderPublicKey;
        let keypair;
        const url = `${host}/setup`;
        console.log(wallet)
        switch (wallet) {
            case WTYPE.WALLET1: {
                $('.setupChannel1').buttonLoader('start');
                initiatorDeposit = $('#pc_w2_deposit').val()
                responderDeposite = $('#pc_w1_deposit').val()
                initiatorPublicKey = $('#pc_w2_publicKey').find(":selected").text().split('|')[0].trim() //$('#pc_w2_publicKey').val()
                responderPublicKey = $('#pc_w1_publicKey').val()
                keypair = {
                    secretKey: $('#pc_w1_privateKey').val(),
                    publicKey: $('#pc_w1_publicKey').val()
                }
                break
            }
        }

        let body = {
            initiatorPublicKey: initiatorPublicKey,
            responderPublicKey: responderPublicKey,
            initiatorAmount: initiatorDeposit == "" ? 0 : initiatorDeposit,
            responderAmount: responderDeposite == "" ? 0 : responderDeposite,
            keypair: keypair
        }


        //// Notifiation
        const data = body
        delete data[keypair]
        console.log(body)
        const msg = {
            type: mTypes.INITIATE,
            body: data
        }
        notify(msg)
        //// Notifiation

        console.log(body)

        const resp = await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const json = await resp.json();
        $('.setupChannel1').buttonLoader('stop');
        if (json && json.status != 200) alert(`Error: ${json.data}`)
        console.log(json)
        // $('#channelId').val(json.data.channelId)
        $('#modal_channelId').text(json.data.channelId)
        body.initiatorPublicKey = body.responderPublicKey
        body.initiatorDeposit = body.responderDeposite
        await channelStatus(body)
        $('.connectChannel1').attr('hidden')
    } catch (e) {
        $('.setupChannel1').buttonLoader('stop');
        alert(`Error: ${e.toString()}`)
    }
}

async function leaveChannel(wallet) {
    const url = `${host}/leave`;
    let channelId = $('#modal_channelId').text();
    let publicKey;
    switch (wallet) {
        case WTYPE.WALLET1: {
            $('.leaveChannel1').buttonLoader('start');
            publicKey = $('#pc_w1_publicKey').val()
            break
        }
    }

    const body = {
        channelId: channelId,
        publicKey: publicKey,
    }

    const resp = await fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    const json = await resp.json();

    $('.leaveChannel1').buttonLoader('stop');

    if (json && json.status != 200) alert(`Error: ${json.data}`)

    alert(json.data)
}

async function reconnectChannel(wallet) {
    const url = `${host}/reconnect`;
    let channelId = $('#modal_channelId').text();
    let keypair;
    switch (wallet) {
        case WTYPE.WALLET1: {
            $('.reconnectChannel1').buttonLoader('start');
            keypair = {
                secretKey: $('#pc_w1_privateKey').val(),
                publicKey: $('#pc_w1_publicKey').val()
            }
            break
        }
    }

    const body = {
        channelId: channelId,
        keypair: keypair,
    }

    const data = await callAPI(url, body)
    $('.reconnectChannel1').buttonLoader('stop');
    data == true ? alert('Reconnected!') : alert('Error: Could not reconnect!')

}

async function callAPI (url, body) {
    const resp = await fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    const json = await resp.json();
    if (json && json.status != 200) throw new Error(json.data)
    return json.data
}

async function spendOffChain(wallet) {
    const url = `${host}/offspend`;
    let channelId = $('#modal_channelId').text();
    let keypair;
    let amount;
    let receiverPublicKey;
    let spenderAlias 
    let receiverAlias
    try {
        
        // spenderAlias = $('#pc_w1_alias').val()
        // receiverAlias = $('#pc_w2_publicKey').find(":selected").text().split('|')[1].trim()
            
        const selected = $('#pc_w2_publicKey').find(":selected").text().split('|')[0].trim()
        if (selected != "" && selected != "Select Address") {
            receiverPublicKey = selected
        } else {
            receiverPublicKey = $('#modal_responder').text()
        }
    } catch (e) {
        receiverPublicKey = $('#modal_responder').text()
    }
    try {

        $('.spendOffChain1').buttonLoader('start');
        keypair = {
            secretKey: $('#pc_w1_privateKey').val(),
            publicKey: $('#pc_w1_publicKey').val()
        }
        amount = $('#pc_w1_amount').val()
        const body = {
            keypair: keypair,
            channelId: channelId,
            amount: amount,
            receiverPublicKey: receiverPublicKey,
            spenderAlias,
            receiverAlias,
            memo: "Sending money to the shop keeper"
        }

        const resp = await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const json = await resp.json();

        $('.spendOffChain1').buttonLoader('stop');

        if (json && json.status != 200) alert(`Error: ${json.data}`)

        const { result, status } = json.data
        const { balances, state } = status
        const l = result.signedTx.length

        const tableRowData = {
            signedTx: result.signedTx,
            spender: body.keypair.publicKey,
            beneficiary: body.receiverPublicKey,
            spenderbal: balances[body.keypair.publicKey],
            beneficiarybal: balances[receiverPublicKey],
            spenderAlias,
            receiverAlias,
            amount: body.amount,
            round: state.round
        }

        console.log(tableRowData)

        //TODO: notify the other user about this tx
        const msg = {
            type: mTypes.TRANSACTION,
            body: tableRowData
        }
        notify(msg)

        //TODO: also add this transaction to your list
        appendTx(tableRowData)
    } catch (e) {
        $('.setupChannel1').buttonLoader('stop');
        alert(`Error: ${e.toString()}`)
    }

}

async function channelStatus(init) {
    try {
        $('.channelStatus').buttonLoader('start');
        const channelId = $('#modal_channelId').text()
        const url = `${host}/status?channelId=${channelId}`;
        const resp = await fetch(url)
        const json = await resp.json()
        $('.channelStatus').buttonLoader('stop');
        if (json && json.status != 200) throw new Error(json.data)

        $('.chdetails').removeAttr('hidden')

        const { state, balances } = json.data

        const yourPk = $('#pc_w1_publicKey').val()
        const peer2Pk = Object.keys(balances).find(x => x != yourPk)
        const body = {
            init,
            status: {
                channelId: state.channelId,
                fsmId: state.fsmId,
                round: state.round,
                initiatorbalance: balances[yourPk],
                responderbalance: balances[peer2Pk],
                status: state.status
            }
        }
        fillDataIntoStatusModal(body)
        $('.connectChannel1').removeAttr('hidden')
        // $("#acceptChannel").modal("show")

    } catch (e) {
        $('.channelStatus').buttonLoader('stop');
        alert(`Error: ${e.toString()}`)
    }
}

async function closeChannel() {
    try{        
        $('.closeChannel').buttonLoader('start');
        const url = `${host}/close`;
        const channelId = $('#modal_channelId').text();
        
        const keypair = {
            secretKey: $('#pc_w1_privateKey').val(),
            publicKey: $('#pc_w1_publicKey').val()
        }
        const body = {
            channelId,
            keypair
        }
        debugger

        const data = await callAPI(url,body)
        if(data.txType === "signedTx"){
            $('.closeChannel').buttonLoader('stop')
            await updateBalance()
            const mess = `Channel is closed by ${shortenStr(keypair.publicKey)}`
            alert(mess)
            //TODO: notify the other user about this
            // const msg = {
            //     type: mTypes.TRANSACTION,
            //     body: tableRowData
            // }
            // notify(mess)
        }
    }catch(e){
        $('.closeChannel').buttonLoader('stop')
        alert(`Error: ${e.toString()}`)
    }
}

const appendTx = (tableRowData) => {
    console.log(tableRowData)
    const color = tableRowData.beneficiary === $('#pc_w1_publicKey').val() ? "lightgreen" : "#ff000036";
    const tr = `<tr style="background-color:${color}">
                    <td>${shortenStr(tableRowData.signedTx)}</td>
                    <td>${tableRowData.round}</td>
                    <td>${shortenStr(tableRowData.spender)}</td>
                    <td>${shortenStr(tableRowData.beneficiary)}</td>
                    <td>${tableRowData.amount}</td>
                    </tr>`
                    // <td>${tableRowData.spenderbal}</td>
                    // <td>${tableRowData.beneficiarybal}</td>

    const tbody = $('.txTable tbody')
    tbody.append(tr);
}

const shortenStr = (str) => {
    str = str.toString()
    const l = str.length
    return str.substring(0, 15) + '...' + str.substring(l - 5, l)
}

const updateBalance = () => {
    try{
        $('.balanceWallet1').buttonLoader('start')
        setTimeout(async () => {
            const publicKey = $('#pc_w1_publicKey').val()
            const url = `${host}/balance?publicKey=${publicKey}`;
            const resp = await fetch(url)
            const json = await resp.json()
            const bal = json.data
            $('#balanceWallet1_lbl').text(bal)
            $('.balanceWallet1').buttonLoader('stop')
        }, 1000)
    }catch(e){
        $('.balanceWallet1').buttonLoader('stop')
        alert(e.message)
    }
}


