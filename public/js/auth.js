{/* <script src="http://192.168.1.5:8080/auth/js/keycloak.js"></script> */}
    /* If the keycloak.json file is in a different location you can specify it:

    Try adding file to application first, if you fail try the another method mentioned below. Both works perfectly.

    var keycloak = Keycloak('http://localhost:8080/myapp/keycloak.json'); */

    /* Else you can declare constructor manually  */

    // var keycloak = Keycloak({
    //     url: 'http://192.168.1.5:8080/auth',
    //     realm: 'master',
    //     clientId: 'hs-playground-local'
    // });


    // keycloak.init({onLoad: 'check-sso' })
    // .then(function(authenticated) {
    //     alert(authenticated ? 'authenticated' : 'not authenticated');
    // }).catch(function() {
    //     alert('failed to initialize');
    // });

    // function logout() {
    //     keycloak.logout('http://192.168.1.5:8080/auth/realms/Internal_Projects/protocol/openid-connect/logout?redirect_uri=encodedRedirectUri')
    //     //alert("Logged Out");
    // }

const checkAuth = (cname) => {

    let cvalue = getCookie(cname);
    console.log(`cookie value for ${cname} is ${cvalue}`)
    if (cvalue != "") {
        console.log(`Setting value for ${cname} is ${cvalue} in textbox`)
        return cvalue
    } else {
        return false
    }
}
$(document).ready(function () {

    if (checkAuth('token'))
    {
        alert('Cookie is set')
        $('.auth--check').show()
        $('.auth--uncheck').hide()
    } else {
        let pubKey = formatBech32('one1m6mucnf577j2uecark5swpeexz79st8jgl77yy',false,8,8)
        
        $('.formatBech32').text( pubKey)
        $('.auth--check').hide()
        $('.auth--uncheck').show()
    }
});