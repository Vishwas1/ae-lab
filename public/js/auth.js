    // let link = 'https://' +window.location.host + '/keycloak.json'
    const  kcconfig = require('../keycloak.json')
    const keycloak = new Keycloak({
        url: "https://www.hsauth.hypermine.in/keycloak/auth",
        relam: "master",
        clientId: "ae-lab"
    });
    
    const logout = () => {
        keycloak.logout()
    }

    const login = () => {
        keycloak.login()
    }

    const setUserProfile = () => {
        //Setting data to be displayed on the side var

        //PubKey
        $('.formatBech32').text('')
        // let pubKey = formatBech32(keycloak.subject.toS)
        let str = keycloak.subject
        let last4Chr = str.substr(str.length - 7);
        let firt4Chr = str.substr(0,6);
        $('.formatBech32').text(firt4Chr + '...' + last4Chr)

        //UserName  
        let userName = keycloak.tokenParsed.preferred_username
        $('.userName').text(userName)

        //Email
        $('.userEmail').text(keycloak.tokenParsed.email)

        //User Initial
        $('.userInitial').text(userName.substring(0, 2).toUpperCase())

    }

    $(document).ready(function () {
        
        //If user is looged 
        // Chec if someone is loogedin the session
        // Then dont do anything keep in the same browser

        //if user is not logged
        
        keycloak.init({ onLoad: 'check-sso' }).then(function (authenticated) {
            if (authenticated) {
                setUserProfile()
                $('.auth--check').show()
                $('.auth--uncheck').hide()
            } else {
                $('.auth--check').hide()
                $('.auth--uncheck').show()
            }
        }).catch(function () {
            console.log('failed to initialize');
        });
        
    });


