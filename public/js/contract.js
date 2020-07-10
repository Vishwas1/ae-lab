const editor = ace.edit("editor")
editor.setTheme("ace/theme/monokai");
// editor.session.setMode("ace/mode/javascript");

const sampleContract = `
/** Sample Sophia code **/
contract ToDoList = 

  // define contents of state as record state = { } to hold tasks.
  record task = {
    name : string,
    completed : bool
    }
  
  //The smart contract should be able to store several tasks and those tasks should be indexed
  //Each task should contain a variable "name" and a variable "completed" which can only be true or false
  record state = {
    taskList  : map(int, task) 
    }

  // initialize state with empty data
  entrypoint init() : state = {
      taskList =  {}
    }

  // The entrypoint "add_task" is accepting a new task name,
  //    define a new task and store it to the state,
  //    Hint: put(state{}) allows you to mutate state
  stateful entrypoint add_task(task_name: string) =
    let task = {
      name = task_name,
      completed = false 
      }
    put(state{ taskList[ Map.size(state.taskList) + 1 ] = task })
    

  // set existing task of state to completed
  stateful entrypoint set_task_completed(seq_id : int) =
    put(state{ taskList[seq_id].completed = true })    

  // return all tasks of state in format {name: string, completed: bool}
  entrypoint get_tasks() : map(int, task) =
    state.taskList
`

// $('#source_code').val(sampleContract)
editor.setValue(sampleContract);

const compileContract = async () => {
    
    const source = editor.getValue();
    $('#console').val("");
    $('.compileContract').buttonLoader('start');

    const url = `${host}/api/contract/compile`;
    
    const keypair = {
        privateKey: $('#modal_sign_privateKey').val(),
        publicKey : $('#modal_sign_publicKey').val()
      }

    setCookie("privateKey", keypair.privateKey, 30);
    setCookie("publicKey", keypair.publicKey, 30);

    const body = {
        code : source,
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

    const url = `${host}/api/contract/deploy`;
    const source = editor.getValue();    
    const keypair = {
        privateKey: getCookie("privateKey"),
        publicKey : getCookie("publicKey")
      }

    if(keypair.privateKey == "" || keypair.publicKey == "") {
        alert("Error: Please compile before proceeding")
        return 
    }

    const body = {
        code : source,
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

    const url = `${host}/api/contract/call`;
    
    const keypair = {
        privateKey: getCookie("privateKey"),
        publicKey : getCookie("publicKey")
      }
    
    if(keypair.privateKey == "" || keypair.publicKey == "") {
        alert("Error: Please compile before proceeding")
        return 
    }

    const source = editor.getValue();    

    const contractAddress = $('#contractId').val();
    const fn = $('#methods').children('option:selected').val();
    if(contractAddress == "" || fn == "") {
        alert("Error: Please deploy before proceeding")
        return
    }

    const commaSepArgs = $('#args').val();
    const argsArr = commaSepArgs != "" ? commaSepArgs.split(',') : []

    const body = {
        code : source,
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