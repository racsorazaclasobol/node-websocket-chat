import { request, response } from "express";
import mongoose from 'mongoose';
import { Categoria, Usuario, Producto } from "../models/index.js";

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = mongoose.Types.ObjectId.isValid( termino );

    if( esMongoID ){
        const usuario = await Usuario.findById( termino );
        
        res.json( {
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); //Creamos una expresión regular a la que le indicamos que no sea sensible, es decir que si el nombre es Test 01 y busmcamos test, me muestre todos los que tengan test en su nombre

    const usuarios = await Usuario.find({ 
        $or: [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
     })

    res.json( {
        results: ( usuarios ) ? [ usuarios ] : []
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = mongoose.Types.ObjectId.isValid( termino );

    if( esMongoID ){
        const categoria = await Categoria.findById( termino );
        
        res.json( {
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); //Creamos una expresión regular a la que le indicamos que no sea sensible, es decir que si el nombre es Test 01 y busmcamos test, me muestre todos los que tengan test en su nombre

    const categorias = await Categoria.find({ nombre: regex, estado: true })

    res.json( {
        results: ( categorias ) ? [ categorias ] : []
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = mongoose.Types.ObjectId.isValid( termino );

    if( esMongoID ){
        const producto = await Producto.findById( termino ).populate( 'categoria', 'nombre' );
        
        res.json( {
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); //Creamos una expresión regular a la que le indicamos que no sea sensible, es decir que si el nombre es Test 01 y busmcamos test, me muestre todos los que tengan test en su nombre

    const productos = await Producto.find({ nombre: regex, estado: true }).populate( 'categoria', 'nombre')

    res.json( {
        results: ( productos ) ? [ productos ] : []
    });

}

const buscar = async( req = request, res = response ) => {

    const { coleccion, termino } = req.params

    if( !coleccionesPermitidas.includes( coleccion ) ) return res.status(400).json({ msg: `La colección sleccionada no está dentro de las permitidas: ${ coleccionesPermitidas }` })

    switch( coleccion ){
        case 'usuarios':
            buscarUsuarios( termino, res )
        break;

        case 'categorias':
            buscarCategorias( termino, res )
        break;

        case 'productos':
            buscarProductos( termino, res )
        break;

        default:
            res.status(500).json({ msg: 'Error' })    
                            
    }

}

export {
    buscar,
}