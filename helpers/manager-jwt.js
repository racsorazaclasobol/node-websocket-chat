import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

//Capitulo 149
const generarJWT = ( uid = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETPRIVATEKEY, { 

            expiresIn: '4h'

        }, ( error, token ) => {
            
            if( error ){
                console.log(error);
                reject( 'Error al generar el Token' )
            }else{
                resolve( token )
            }

        })

    });

}

const comprobarJWT = async( token = '' ) => {

    try {

        if (token.length <= 10) return null;

        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) return null; 
        if ( !usuario.estado ) return null; 

        return usuario;
        
    } catch (error) {
        return null;        
    }

}

export { 
    generarJWT,
    comprobarJWT
}