import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.js';

//Capitulo 151 - 152
const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header( 'x-token' );
    
    if( !token ) return res.status(401).json({ msg: 'Token inválido' });

    try {

        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );

        const usuarioAutenticado = await Usuario.findById( uid );

        if( !usuarioAutenticado ) return res.status(401).json({ msg: 'Token no válido - Usuario no existe.' })
        if( !usuarioAutenticado.estado ) return res.status(401).json({ msg: 'Token no válido - Usuario deshabilitado.' })

        req.usuarioAutenticado = usuarioAutenticado; //Creo un parametro en la request para poder acceder a ella en los controllers

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Token inválido' });
    }

}

export {
    validarJWT,
}