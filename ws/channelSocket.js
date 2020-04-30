const WebSocket = require('websocket')
const allowedOrigins = ['http://localhost:3000', 'https://ae-labs.herokuapp.com/'];

module.exports = (server) => {
    const TIME = () => new Date();
    const wss = new WebSocket.server({ 
        httpServer: server, // Tieing websocket to HTTP server
        autoAcceptConnections: false
     })
    
    let clients = []
    let users = {}

    const mTypes = Object.freeze({
        LISTUSER : 'list-channel-users',
        ADDUSER: 'add-channel-user',
        ERROR: 'error',
        TRANSACTION: 'transaction',
        ACCEPT: 'channel-accept',
        REJECT: 'channel-reject',
        INITIATE: 'channel-initiate',
        CLOSE: 'channel-close',
        LEAVE: 'channel-leave',
        RECONNECT: 'channel-reconnect',
        CLOSE: 'channel-close'
    }) 
    
    originIsAllowed = (origin) => {
        return true;
        if(allowedOrigins.indexOf(origin) === -1) return false
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }
    wss.on('request', (request) => {
        console.log(`${TIME()} Client connection from ${request.origin} receieved`)
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((TIME()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        const connection = request.accept(null, request.origin)
        console.log(`${TIME()} Client accepted`)
    
        let index = clients.push(connection) - 1;
        let uIndex;
        let userName = false;
        let userColor = false;
    
        if(Object.keys(users).length > 0){
            clients.forEach((client, i) => {
                client.sendUTF(JSON.stringify({
                    type: mTypes.LISTUSER,
                    data: users
                }))                    
            })
        }

        connection.on('message', (m) => {        
            
            if(m.type != 'utf8'){
                client[index].sendUTF(JSON.stringify({
                    type: 'error',
                    data: "Only text is accepted"
                }))
                return
            }

            const { type, body } = JSON.parse(m.utf8Data)
            console.log(JSON.parse(m.utf8Data))
            switch(type){
                case mTypes.ACCEPT: {
                    break
                }
                case mTypes.INITIATE:{
                    console.log('New channel initiation message from ')
                    const { initiatorPublicKey } = body 
                    const receiverClient = clients[users[initiatorPublicKey].clientIndex] 
                    console.log('Forwarding the message to ', initiatorPublicKey)
                    receiverClient.sendUTF(JSON.stringify({
                        type: mTypes.ACCEPT,
                        data: body
                    }))
                    break
                }
                case mTypes.TRANSACTION: {
                    console.log('New channel transaction message')
                    const { beneficiary } = body
                    const receiverClient = clients[users[beneficiary].clientIndex] 
                    console.log('Forwarding the message to ', beneficiary)
                    receiverClient.sendUTF(JSON.stringify({
                        type: mTypes.TRANSACTION,
                        data: body
                    }))
                    break
                }
                case mTypes.CLOSE: {
                    console.log('New channel transaction message')
                    const { peer1, peer2 } = body
                    const receiverClient = clients[users[peer2].clientIndex] 
                    console.log('Forwarding the message to ', peer2)
                    receiverClient.sendUTF(JSON.stringify({
                        type: mTypes.CLOSE,
                        data: body
                    }))
                    break
                }
                case mTypes.ADDUSER: {
                    const { alias, publicKey } = body
                    console.log('New add user message alias', alias)
                    if(users[publicKey] === undefined){
                        // new user
                        users[publicKey] = {
                            alias,
                            balance: 0,
                            clientIndex: index,
                            publicKey
                        }
                        console.log('Forwarding the message to all others users')
                        clients.forEach((client, i) => {
                            if(i != index) {
                                client.sendUTF(JSON.stringify({
                                    type: mTypes.LISTUSER,
                                    data: users[publicKey]
                                }))                    
                            }
                        })
                    }else{
                        clients[index].sendUTF(JSON.stringify({
                            type: mTypes.ERROR,
                            data: "The user alredy exists"
                        }))
                    }
                    break
                }
            }
        })
    
        connection.on('close', (conn) => {
            console.log(`WS connection closed`)
            if(userName !== false && userColor !== false){
                console.log(`${TIME()} User ${userName} disconnected`)
                clients.splice(index, 1)
                userNames.splice(uindex, 1)
                colors.push(userColor)
                clients.forEach((client, i) => {
                    client.sendUTF(JSON.stringify({
                        type: 'users',
                        data: userNames
                    }))                    
                })                
            }
    
        })
    })
    
}