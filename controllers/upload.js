import { request, response } from "express";
import { v2 as cloudinary } from 'cloudinary'
import { fileURLToPath } from "url";
import path from 'path'
import fs from 'fs'

import { uploadFile } from '../helpers/index.js';
import { Producto, Usuario } from "../models/index.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({ 
    cloud_name: 'dmuswnvaf', 
    api_key: '485988593188787', 
    api_secret: '9mk0sDkGNfIu_aXKhFxvntL3T0w',
    secure: true
  })

const cargarArchivos = async( req, res = response ) => {

    try {
     
        const nombre = await uploadFile.subirArchivo( req.files, undefined, 'imgs' );
    
        res.json({ nombre });
        
    } catch (error) {

        res.status(400).json({ error });
    }

}

const actualizarImagenClouinary = async( req, res = response ) => {

    try {
    
        const { coleccion, id } = req.params;

        let modelo;

        switch ( coleccion ) {
            case 'usuarios':
                
                modelo = await Usuario.findById( id );
                if ( !modelo ) return res.status(400).json({ msg: `No existe un usuario con la id: ${ id }` })
                
                break;
            case 'productos':

                modelo = await Producto.findById( id );
                if ( !modelo ) return res.status(400).json({ msg: `No existe un producto con id: ${ id }` })

                break;
        
            default:
                return res.status(500).json({ msg: 'Se me olvidó validar esto' });
        }

        if( modelo.img ) { //Capitulo 206 - Borrar imagenes previas 

            const nombreArr = modelo.img.split( '/' );
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');

            cloudinary.uploader.destroy( public_id );
            
            //*: Hay que borrar la imagen del servidor
            
        }
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        modelo.img = secure_url;

        await modelo.save();

        res.json( modelo ) ;
        
    } catch (error) {

        res.status(400).json({ error });
    }

}

const actualizarImagen = async( req = request, res = response ) => {

    try {
    
        const { coleccion, id } = req.params;

        let modelo;

        switch ( coleccion ) {
            case 'usuarios':
                
                modelo = await Usuario.findById( id );
                if ( !modelo ) return res.status(400).json({ msg: `No existe un usuario con la id: ${ id }` })
                
                break;
            case 'productos':

                modelo = await Producto.findById( id );
                if ( !modelo ) return res.status(400).json({ msg: `No existe un producto con id: ${ id }` })

                break;
        
            default:
                return res.status(500).json({ msg: 'Se me olvidó validar esto' });
        }

        // Limpiar imagenes previas (Capítulo 201)
        if( modelo.img ) {
            
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )

            if( fs.existsSync( pathImagen ) ){

                fs.unlinkSync( pathImagen ); //Borra el archivo

            }
        }

        const nombre = await uploadFile.subirArchivo( req.files, undefined, coleccion );
        modelo.img = nombre;

        await modelo.save();

        res.json({ modelo});
        
    } catch (error) {

        res.status(400).json({ error });
    }

}

const mostrarImagenes = async( req = request, res = response ) => {

    try {
    
        const { coleccion, id } = req.params;

        let modelo;

        switch ( coleccion ) {
            case 'usuarios':
                
                modelo = await Usuario.findById( id );
                if ( !modelo ) return res.status(400).json({ msg: `No existe un usuario con la id: ${ id }` })
                
                break;
            case 'productos':

                modelo = await Producto.findById( id );
                if ( !modelo ) return res.status(400).json({ msg: `No existe un producto con id: ${ id }` })

                break;
        
            default:
                return res.status(500).json({ msg: 'Se me olvidó validar esto' });
        }

        // Limpiar imagenes previas (Capítulo 201)
        if( modelo.img ) {
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )

            if( fs.existsSync( pathImagen ) ){

                return res.sendFile( pathImagen )

            }
        }

        const defaultNoImagePath = path.join( __dirname, '../assets/', 'no-image.jpg' );

        res.sendFile( defaultNoImagePath );
        
    } catch (error) {
        console.log(error)
        res.status(400).json( error );
    }

}

export {
    cargarArchivos,
    actualizarImagenClouinary,
    actualizarImagen,
    mostrarImagenes
}