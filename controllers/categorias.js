import { request, response } from "express";
import { Categoria, Usuario } from '../models/index.js'


const obtenerCategorias = async( req = request, res = response ) => {

    try {

        const { limite = 0, desde = 0 } = req.query;
        const query = { estado: true };
    
        const categoria = await Categoria.find( query ).limit(limite).skip(desde).populate( 'usuario', 'nombre' );
    
        res.status(200).json({
            categoria
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error, inténtelo más tarde.' })      
    }

}

const obtenerCategoriasId = async( req = request, res = response ) => {

    try {

        const { id } = req.params;
        const { limite, desde } = req.query;
    
        const categoria = await Categoria.findById( id ).limit( limite ).skip( desde ).populate( 'usuario', 'nombre' );
    
        res.status(200).json({
            categoria
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error, inténtelo más tarde.' })      
    }

}

const crearCategoria = async( req = request, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    try {

        console.log(nombre)
        
        const categoriaDB = await Categoria.findOne({ nombre });
    
        if ( categoriaDB ) return res.status(400).json({ msg: `La categoría ${ nombre } ya existe.` });
    
        const data = {
            nombre,
            usuario: req.usuarioAutenticado._id
        }
    
        const categoria = await new Categoria( data );
        
        //*Guardar DB
        await categoria.save();

        res.status(201).json( categoria );

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error, inténtelo más tarde.' })        
    }


}

const actualizarCategoria = async(  req = request, res = response  ) => {

    try {
        
        const { id } = req.params;
        const nombre = req.body.nombre.toUpperCase();
    
        const categoria = await Categoria.findByIdAndUpdate( id, { nombre }, { new: true } ) 
    
        res.status(200).json({ 
            categoria
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' })
    }

}

const borrarCategoria = async(  req = request, res = response  ) => {

    try {

        const { id } = req.params;

        const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );       
        
        res.json({ 
            categoria
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ha ocurrido un error, intentelo más tarde.' })
    }
}

export { 

    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasId,

}