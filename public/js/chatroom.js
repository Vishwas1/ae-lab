$(function () {
    "use strict";
    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    var activeUser = $('#activeusr')
    var hideChat = $('#close')
    var showChat = $('#show-chat-btn')

    hideChat.click(function (params) {
        $('#chat').hide();
        $('#show-chat-btn').show();
    })

    showChat.click(function (params) {
        $('#chat').show();
        $('#show-chat-btn').show();
    })
    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>',
            { text: 'Sorry, but your browser doesn\'t support WebSocket.' }
        ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket(`ws://${window.location.host}`);
    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        addMessage(undefined, "Connected! Please enter your name and chat!")
        status.text('Choose name:');
    };
    connection.onerror = function (error) {
        // just in there were some problems with connection...
        content.html($('<p>', {
            text: 'Sorry, but there\'s some problem with your '
                + 'connection or the server is down.'
        }));
    };
    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server
        // always returns JSON this should work without any problem but
        // we should make sure that the massage is not chunked or
        // otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }
        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        // first response from the server with user's color
        if (json.type === 'color') {
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                    json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            // let the user write another message
            input.removeAttr('disabled');
            addMessage(json.data.author, json.data.text,
                json.data.color, new Date(json.data.time));
        } else if (json.type === 'newJoinee') {
            const m = `${json.data} has joined the chat room!`
            addMessage(undefined, m, undefined, undefined)
        }
        else {
            console.log('Hmm..., I\'ve never seen JSON like this:', json);
        }
    };

    /**
     * Send message when user presses Enter key
     */
    input.keydown(function (e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');
            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });
    /**
     * This method is optional. If the server wasn't able to
     * respond to the in 3 seconds then show some error message 
     * to notify the user that something is wrong.
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val(
                'Unable to communicate with the WebSocket server.');
        }
    }, 3000);
    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        if (author == undefined) {
            content.prepend('<p><span style="font-style: italic; color: grey">' + message + '</span><p>')
            return
        }
        content.prepend('<p><span style="color:' + color + '">'
            + author + '</span> @ ' + (dt.getHours() < 10 ? '0'
                + dt.getHours() : dt.getHours()) + ':'
            + (dt.getMinutes() < 10
                ? '0' + dt.getMinutes() : dt.getMinutes())
            + ': ' + message + '</p>');
    }

    var users = ["Vishwas", "Vikram", "Amit", "Vishwas", "Vikram", "Amit", "Vishwas", "Vikram", "Amit", "Vishwas", "Vikram", "Amit"]
    users.forEach((user, i) => {
        addUser(user);
    })
    /**
     * Add Active User to the right window
     */
    function addUser(user) {

        // activeUser.append('<p class="border-bottom"><span style="font-style: italic; color: grey">' + user + '</span><p>')
        activeUser.append('<a href="#" class="list-group-item"><i class="fa fa-circle" aria-hidden="true" style="color:green; padding-right: 4px"></i><span style="font-style: italic; color: grey">' + user + '</span></a>')
    }


});

