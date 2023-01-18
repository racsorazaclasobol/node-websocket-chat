import { request, response } from "express";
import { Producto } from "../models/index.js";

const obtenerProductos = async( req = request, res = response ) => {

    try {

        const { limite, desde } = req.query;
        const query = { estado: true };  

        const producto = await Producto.find    ( query )
                                       .limit   ( limite )
                                       .skip    ( desde )
                                       .populate( 'categoria', 'nombre' )
                                       .populate( 'usuario', 'nombre' );

        res.json( {
            producto

        } )        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' });
    }
}

const obtenerProductosID = async( req = request, res = response ) => {

    try {

        const { id } = req.params;
        const { limite, desde } = req.query;
        const query = { estado: true };
        
        const producto = await Producto.findById( id, query )
                                       .limit   ( limite )
                                       .skip    ( desde )
                                       .populate( 'categoria', 'nombre' )
                                       .populate( 'usuario', 'nombre' );
        
        res.json( producto );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' });
    }
}

const crearProducto = async( req = request, res = response ) => {

    try {
        
        const productoEntrada = req.body;
        productoEntrada.nombre = productoEntrada.nombre.toUpperCase();
    
        const producto = await new Producto( productoEntrada );
        
        await producto.save();
    
        res.json( producto );

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' })
    }

}

const modificarProducto = async( req = request, res = response ) => {

    try {
        
        const { id } = req.params;
        const { nombre, estado, ...data } = req.body;

        if( nombre ) data.nombre = nombre.toUpperCase();

        data.usuario = req.usuarioAutenticado._id;
    
        const producto = await Producto.findByIdAndUpdate( id, data, { new: true } ) 
    
        res.status(200).json( producto );

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' })
    }

}

const eliminarProducto = async( req = request, res = response ) => {

    try {
        
        const { id } = req.params;
        const query = { estado: false }

        const producto = await Producto.findByIdAndUpdate( id, query, { new: true } ) 
    
        res.status(200).json( producto );

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' })
    }

}

export{ 

    crearProducto,
    obtenerProductos,
    obtenerProductosID,
    modificarProducto,
    eliminarProducto

}