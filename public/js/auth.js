//Referencias HTML
const btnSignOut = document.getElementById("google_sign_out");
const miFormulario = document.querySelector("form");

const url = 'http://localhost:8080/api/auth/'

function handleCredentialResponse(response) {
    //Capitulo 163
    // console.log('id_token ', response.credential);

    //Capitulo 165
    const body = { id_token: response.credential };

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( body )
    })
    .then( resp => resp.json() )
    .then( ({ token }) => {
        localStorage.setItem( 'x-token', token );
        window.location = 'chat.html';
    } )
    .catch( console.warn )

}

btnSignOut.onclick = () => { //Capitulo 167

    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();
    
    google.accounts.id.revoke( localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    } )

}

miFormulario.addEventListener( 'submit', ev => {
    ev.preventDefault();

    const formData = {};

    for (const el of miFormulario.elements) {
        if( el.namespaceURI.length > 0 )        
        formData[ el.name ]= el.value;
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ) return console.log(msg);
        localStorage.setItem( 'x-token', token );
        window.location = 'chat.html';
    } )
    .catch( err => { console.log( err ) })

} )