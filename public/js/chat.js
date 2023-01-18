// Referencias HTML
const txtUid        = document.querySelector('#txtUid');
const txtMensaje    = document.querySelector('#txtMensaje');
const ulUsuarios    = document.querySelector('#ulUsuarios');
const ulMensajes    = document.querySelector('#ulMensajes');
const btnSalir      = document.querySelector('#btnSalir');


let usuario = null;
let socket  = null;

const url = 'http://localhost:8080/api/auth/'

const validarJWT = async() => {

    const token = localStorage.getItem( 'x-token' ) || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error( 'Token no válido' );
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( 'x-token', tokenDB );

    usuario = userDB;
    document.title = usuario.nombre;

    await conectarToken();
}

const conectarToken = async() => {

    socket = io({  
        'extraHeaders':{
            'x-token': localStorage.getItem( 'x-token' )
        }
    });

    socket.on( 'connect', () => {

        console.log('Sockets online')

    } )

    socket.on( 'disconnect', () => {

        console.log('Sockets offline')

    } )

    socket.on( 'recibir-mensaje', dibujarMensajes );

    socket.on( 'usuarios-activos', dibujarUsuarios );

    socket.on( 'mensaje-privado', ( { de, mensaje } ) => {

        dibujarMensajesPrivados( de, mensaje );

    } )

}

const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = '';

    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `
        <li>
            <p>
                <h5 class="text-success"> ${ nombre } </h5>
                <span class="fs-6 text-muted"> ${ uid } </span>
            </p>
        </li>
        `;

    });
    
    ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = ( mensajes = [] ) => {

    let mensajeHtml = '';

    mensajes.forEach( ({ mensaje, nombre }) => {

        mensajeHtml += `
        <li>
            <p>
                <span class="text-primary"> ${ nombre } </span>
                <span> ${ mensaje } </span>
            </p>
        </li>
        `;

    });
    
    ulMensajes.innerHTML = mensajeHtml;

}

const dibujarMensajesPrivados = ( de, mensaje ) => {

    let mensajeHtml = '';

        mensajeHtml += `
        <li>
            <p>
                <span class="text-success"> ${ de } </span>
                <span> ${ mensaje } </span>
            </p>
        </li>
        `;
    
    ulMensajes.innerHTML = mensajeHtml;

}

txtMensaje.addEventListener( 'keyup', ({ keyCode }) => {

    const uid = txtUid.value;
    const mensaje = txtMensaje.value;

    if ( keyCode !== 13 ) return;
    if( mensaje.length === 0 ) return;

    socket.emit( 'enviar-mensaje', { mensaje, uid } );

    txtMensaje.value = '';

})

const main = async() => {

    await validarJWT();

}

main();
