const WebSocket = require('websocket')
const allowedOrigins = ['http://localhost:3000', 'https://ae-labs.herokuapp.com/'];
module.exports = (server) => {
    const TIME = () => new Date();
    const wss = new WebSocket.server({ 
        httpServer: server, // Tieing websocket to HTTP server
        autoAcceptConnections: false
     })
    
    let clients = []
    let history = []
    let userNames = []
    let colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
    // ... in random order
    colors.sort((a,b) => { return Math.random() > 0.5; } )
    
    const htmlEntities = (str) => {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
    
    originIsAllowed = (origin) => {
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
    
        if(history.length > 0){
            console.log(userNames)
            connection.sendUTF(JSON.stringify({
                type: 'history',
                data: {history, userNames}
            }))
        }

        if(userNames.length > 0){
            clients.forEach((client, i) => {
                client.sendUTF(JSON.stringify({
                    type: 'users',
                    data: userNames
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
    
            // First message sent by user, becomes their name
            if(userName){
                console.log((TIME()) + ' Received Message from ' + userName + ': ' + m.utf8Data);
                const obj = {
                    time: TIME().getTime(),
                    text: htmlEntities(m.utf8Data),
                    author: userName,
                    color: userColor
                }
                history.push(obj)
                history = history.slice(-100)
    
                const mToBroad = JSON.stringify({
                    type : 'message',
                    data: obj
                })
    
                clients.forEach(client => {
                    client.sendUTF(mToBroad)
                })
            }else{
                userName = htmlEntities(m.utf8Data)
                
                uindex = userNames.push(userName) - 1;
                
                
                clients.forEach((client, i) => {
                    client.sendUTF(JSON.stringify({
                        type: 'users',
                        data: userNames
                    }))                    
                })                
                

                userColor = colors.shift()
                connection.sendUTF(JSON.stringify({
                    type : 'color',
                    data: userColor
                }))
                const newJoinee = JSON.stringify({
                    type: 'newJoinee',
                    data: userName
                })
                clients.forEach((client, i) => {
                    if(i != index) {
                        client.sendUTF(newJoinee)    
                    }
                })
                console.log(TIME() + ' User is known as: ' + userName + ' with ' + userColor + ' color.');
            }
        })
    
        connection.on('close', (conn) => {
            console.log(`WS connection closed`)
            if(userName !== false && userColor !== false){
                console.log(`${TIME()} User ${userName} disconnected`)
                clients.splice(index, 1)
                userNames.splice(uindex, 1)
                colors.push(userColor)

                // const leftRoom = JSON.stringify({
                //     type: 'leftRoom',
                //     data: userNames
                // })
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