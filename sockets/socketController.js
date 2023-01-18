import { Socket } from "socket.io";
import { managerJWT } from '../helpers/index.js'
import Chat from '../models/chat.js'

const chat = new Chat();


const socketController = async( socket = new Socket(), io ) => {

    const token = socket.handshake.headers['x-token'];
    const usuario = await managerJWT.comprobarJWT( token );

    if( !usuario ) return socket.disconnect();

    //Agregar usuario conectado
    chat.conectarUsuario( usuario );
    socket.emit( 'recibir-mensaje', chat.ultimos10 );//Clase 249
    io.emit( 'usuarios-activos', chat.usuariosArr );

    //Conectar a una sala privada - Clase 250
    socket.join( usuario.id ); //Se crea una sala privada cuyo identificador será el id del usuario

    //Desconectar usuario
    socket.on( 'disconnect', () => {
        chat.desconectarUsuario( usuario.id );
        io.emit( 'usuarios-activos', chat.usuariosArr ); //Emito a los usuarios la nueva cantidad de usuarios activos
    });

    //Enviar mensaje
    socket.on( 'enviar-mensaje', ({ uid, mensaje }) => {

        if( uid ) {
            //Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });

        }else{
            chat.enviarMensaje( usuario.id, usuario.nombre, mensaje );
            io.emit( 'recibir-mensaje', chat.ultimos10 );
        }


    })
    console.log( 'Se conectó: ' + usuario.nombre );
    
}



export {
    socketController,
}