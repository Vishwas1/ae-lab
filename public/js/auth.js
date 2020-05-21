    // let link = 'https://' +window.location.host + '/keycloak.json'
    const kcConfig = require('../keycloak.json')

    
    // const config = {
    //     "realm": "master",
    //     "auth-server-url": "https://www.hsauth.hypermine.in/keycloak/auth",
    //     "ssl-required": "external",
    //     "resource": "ae-lab",
    //     "public-client": true,
    //     "confidential-port": 0,
    //     "clientId": 'ae-lab',
    //     "enable-cors": true
    // }
    const keycloak = new Keycloak(kcConfig);
    // const keycloak = new Keycloak(window.location.host+'/keycloak.json');

    const logout = () => {
        // document.cookie = 'KC_RESTART=; path=/; domain=.www.hsauth.hypermine.in; expires=' + new Date(0).toUTCString();
        // document.cookie = 'AUTH_SESSION_ID=; path=/; domain=.www.hsauth.hypermine.in; expires=' + new Date(0).toUTCString();
        // document.cookie = 'HYPERSIGN_QRCODE_SOLVED=; path=/; domain=.www.hsauth.hypermine.in; expires=' + new Date(0).toUTCString();
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
            debugger
            alert('failed to initialize');
        });
        
    });


