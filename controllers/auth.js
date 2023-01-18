import { response, request } from 'express';
import bcryptjs from 'bcryptjs'

import Usuario from '../models/usuario.js'
import { generarJWT } from '../helpers/manager-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';


const authLogin = async( req = request, res = response ) => {

    try {

        const { correo, password } = req.body;

        const usuario = await Usuario.findOne({ correo });

        const validPassword = bcryptjs.compareSync( password, usuario.password ) //Compara los passwords

        if( !validPassword ) return res.status(400).json({ msg: 'Usuario y/o password son incorrectos - Password' })

        //*: Generar JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error, intentelo más tarde'
        })
    }
}

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {//Capitulo 165

        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        //Si el usuario no existe
        if( !usuario ) {// Capitulo 166

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();

        }

        //Validamos que si existe, no esté bloqueado
        if( !usuario.estado ) return res.status(401).json({ msg: 'Usuario bloqueado, comuniquese con atención al cliente.' })

        //Generar JSON Web Token 
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
    }


}

const validarToken = async( req = request, res = response ) => { 

    const usuario = req.usuarioAutenticado;

    //*: Generar JWT
    const token = await generarJWT( usuario.id );

    res.json({ usuario, token })

}

export {
    authLogin,
    googleSignIn,
    validarToken
}