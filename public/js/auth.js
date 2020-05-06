
    const keycloak = new Keycloak('http://192.168.1.2:5000/keycloak.json');

    const logout = () => {
        let logoutUrl = keycloak.createLogoutUrl()
        keycloak.logout(logoutUrl)
    }

    const login = () => {
        keycloak.login()
    }

    const setUserProfile = () => {
        //Setting data to be displayed on the side var

        //PubKey
        $('.formatBech32').text('')
        let pubKey = formatBech32(keycloak.subject, false,4,4)
        $('.formatBech32').text(pubKey)

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
            debugger
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
        // if (checkAuth('token'))
        // {
        //     alert('Cookie is set')
        //     $('.auth--check').show()
        //     $('.auth--uncheck').hide()
        // } else {
        //     let pubKey = formatBech32('one1m6mucnf577j2uecark5swpeexz79st8jgl77yy',false,8,8)

        //     $('.formatBech32').text( pubKey)
        //     $('.auth--check').hide()
        //     $('.auth--uncheck').show()
        // }
    });


