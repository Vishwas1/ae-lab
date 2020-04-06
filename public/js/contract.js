const sampleContract = `
/**
 * #### Sample Contract ####
 * 
*/

contract CryptoHamster =
   datatype event = NewHamster(indexed int, string, hash)

   record state = { hamsters : map(string, hash), next_id : int }

   stateful entrypoint init() = { hamsters = {}, next_id = 0 }

   entrypoint nameExists(name: string) : bool =
      Map.member(name, state.hamsters)

   stateful entrypoint createHamster(hamsterName: string) =
      require(!nameExists(hamsterName), "Name is already taken")
      createHamsterByNameDNA(hamsterName, generateDNA(hamsterName))
   
   entrypoint getHamsterDNA(hamsterName: string) : hash =
      require(nameExists(hamsterName), "Hamster does not exist!")
      state.hamsters[hamsterName]

   stateful function createHamsterByNameDNA(name: string, dna: hash) =
      put(state{hamsters[name] = dna, next_id = (state.next_id + 1)})
      Chain.event(NewHamster(state.next_id, name, dna))
 
   function generateDNA(name : string) : hash =
      String.sha3(name)`

$('#source_code').val(sampleContract)

const compileContract = async () => {
    
    $('#console').val("");
    $('.compileContract').buttonLoader('start');

    const url = `${host}/compile`;
    
    const keypair = {
        privateKey: $('#modal_sign_privateKey').val(),
        publicKey : $('#modal_sign_publicKey').val()
      }

    setCookie("privateKey", keypair.privateKey, 30);
    setCookie("publicKey", keypair.publicKey, 30);

    const body = {
        code : $('#source_code').val(),
        keypair : {
            secretKey : keypair.privateKey,
            publicKey : keypair.publicKey	
        }
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
    $('.compileContract').buttonLoader('stop');

    if(json && json.status != 200) {
        $('#console').val(json.data)
        return 
    }
    
    $('#console').val(json.data.bytecode);
}

const deployContract = async () => {
    // console.log('Compile Contract')
    $('#console').val("");
    $('.deployContract').buttonLoader('start');

    const url = `${host}/deploy`;
    
    const keypair = {
        privateKey: getCookie("privateKey"),
        publicKey : getCookie("publicKey")
      }

    if(keypair.privateKey == "" || keypair.publicKey == "") {
        alert("Error: Please compile before proceeding")
        return 
    }

    const body = {
        code : $('#source_code').val(),
        keypair : {
            secretKey : keypair.privateKey,
            publicKey : keypair.publicKey	
        }
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
    $('.deployContract').buttonLoader('stop');

    if(json && json.status != 200) {
        $('#console').val(json.data)
        return 
    }

    $('#console').val(JSON.stringify(json.data.result));

    $('#contractId').val(json.data.result.address);

    var methodSelect = document.getElementById("methods");
    let selectHTML= "";
    json.data.methods.forEach((m) => {
        selectHTML += `<option value="${m}"> ${m} </option>`;
    })
    methodSelect.innerHTML = selectHTML;

}

const callContractMethod = async () => {
    $('#console').val("");
    $('.callContractMethod').buttonLoader('start');

    const url = `${host}/call`;
    
    const keypair = {
        privateKey: getCookie("privateKey"),
        publicKey : getCookie("publicKey")
      }
    
    if(keypair.privateKey == "" || keypair.publicKey == "") {
        alert("Error: Please compile before proceeding")
        return 
    }

    const contractAddress = $('#contractId').val();
    const fn = $('#methods').children('option:selected').val();
    if(contractAddress == "" || fn == "") {
        alert("Error: Please deploy before proceeding")
        return
    }

    const commaSepArgs = $('#args').val();
    const argsArr = commaSepArgs != "" ? commaSepArgs.split(',') : []

    const body = {
        code : $('#source_code').val(),
        keypair : {
            secretKey : keypair.privateKey,
            publicKey : keypair.publicKey	
        },
        contractAddress: contractAddress,
        fn: fn,
        args: argsArr,
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
    $('.callContractMethod').buttonLoader('stop');

    if(json && json.status != 200) {
        $('#console').val(json.data)
        return 
    }

    $('#console').val(JSON.stringify(json.data));
}