//Creado en el capítulo 110
import { response, request } from 'express';
import bcryptjs from 'bcryptjs'
import  Usuario  from '../models/usuario.js';


const usuariosGet = async(req = request, res = response) => {
    //Capitulo 135 
    const { limite, desde = 0,  } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find( query )
    //                               .limit( limite )
    //                               .skip( desde );

    // const total = await Usuario.countDocuments( query );

    //Al ser ambas consultas no dependientes una de la otra, con esta forma de ejecutarlas
    //el tiempo se reduce a la mitad y ambas se ejecutan a la vez.
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query ).limit( limite ).skip( desde )
    ]);
    
    res.json({ 
        total, 
        usuarios 
    });

}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body; //Agregamos el _id en caso de que alguien mal intencionado lo envie

    if( password ){
        const salt = bcryptjs.genSaltSync(); 
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuarioUpdate = await Usuario.findByIdAndUpdate( id, resto )

    res.json( usuarioUpdate );

}

const usuariosPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //* Encriptar Contraseña
    const salt = bcryptjs.genSaltSync(); 
    usuario.password = bcryptjs.hashSync( password, salt );



    //*Guardar en DB    
    await usuario.save();

    res.json({
        msg: 'Post: Mensaje de respuesta desde Controlador',
        usuario
    })

}

const usuariosDelete = async(req = request, res = response) => {

    const { id } = req.params;

    //Borrado fisico - const usuario = await Usuario.findByIdAndDelete( id ); NO ES RECOMENDADO BORRAR AL USUARIO
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json({
        id,
        usuario
    })

}

export {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}