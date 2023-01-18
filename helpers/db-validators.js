import { Categoria, Producto } from '../models/index.js'
import Role from '../models/role.js'
import Usuario from '../models/usuario.js'

/*  VALIDADORES USUARIOS | AUTH  */

const isRolValido = async(rol = '') => { //Capitulo 130 y 131

    const existe = await Role.findOne({ rol })

    if( !existe ) throw new Error( `El rol '${ rol }' no está registrado en la Base de datos` )

}

const isEmailExist = async( correo = '' ) => {

    const existeEmail = await Usuario.findOne({ correo });

    if( existeEmail ) throw new Error( `El correo '${ correo }' ya está registrado` );

}

const isLoginValid = async( correo = '' ) => {

    const usuario = await Usuario.findOne({ correo });
    
    if( !usuario ) throw new Error('Usuario y/o password son incorrectos - Correo');

    if( !usuario.estado ) throw new Error('Usuario dehabilitado');

}

const isIdExist = async( id ) => {

    const existeId = await Usuario.findById( id );

    if( !existeId ) throw new Error( `El usuario con ID: '${ id }' no existe` );

}

/*  VALIDADORES CATEGORIAS | PRODUCTOS  */

const isIDCategoriaValid = async ( id = '' ) => {
    
    const categoria = await Categoria.findById( id );

    if( !categoria ) throw new Error('La categoría no existe.');

}

const isExistCategoria = async ( nombre = '' ) => {

    const nombreSearch = nombre.toUpperCase();

    const categoria = await Categoria.exists( { nombre: nombreSearch } );

    if( categoria ) throw new Error( `El nombre de categoría ${ nombre } ya existe.` )

}

const isIDProductoValid = async ( id = '' ) => {
    
    const query = { _id: id, estado: true }
    const producto = await Producto.exists( query );

    if( !producto ) throw new Error('El producto no existe.');

}

const isExistProducto = async ( nombre = '' ) => {

    const nombreSearch = nombre.toUpperCase();
    const query = { nombre: nombreSearch, estado: true }
    const producto = await Producto.exists( query );

    if( producto ) throw new Error( `El nombre de categoría ${ nombre } ya existe.` )

}

/* VALIDAR COLECCIONES  */

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if( !incluida ) throw new Error( `La coleccion ${ coleccion } no está permitida` );

    return true;

}




export {
    //Validadores Usuarios | auth
    isEmailExist,
    isIdExist,
    isLoginValid,
    isRolValido,

    //Validadores Categorias | Productos
    isExistCategoria,
    isIDCategoriaValid,
    isIDProductoValid,
    isExistProducto,

    //Validadores Colecciones
    coleccionesPermitidas,

}

