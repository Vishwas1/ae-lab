
async function buildTx(params) {
    console.log('Build TX')
    $('.buildTx').buttonLoader('start');

    const url = `${host}/build`;
    
    const body = {
        sender: $('#sender').val(),
        receiver: $('#reciever').val(),
        amount: parseInt($('#amount').val()),
        payload: "ba_aGVsbG+Vlcnf"// $('#payload').val() != "" ? $('#payload').val() : "ba_aGVsbG+Vlcnf"
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
    $('.buildTx').buttonLoader('stop');

    if(json && json.status != 200) alert(`Error: ${json.data}`)
    let rawTx = document.getElementById('build_rawTx')
    rawTx.textContent = json.data.rawTx;

    checkCookie("rawTx", "build_rawTx")
}