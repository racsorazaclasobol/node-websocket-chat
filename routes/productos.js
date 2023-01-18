import { Router } from 'express'
import { check } from 'express-validator';

import { crearProducto, eliminarProducto, modificarProducto, obtenerProductos, obtenerProductosID } from '../controllers/productos.js';
import { isIDCategoriaValid, isIdExist, isIDProductoValid } from '../helpers/db-validators.js';

import { isAdminRole }      from '../middlewares/validar-roles.js';
import { validarCampos }    from '../middlewares/validar-campos.js';
import { validarJWT }       from '../middlewares/validar-jwt.js';


const router = Router();

router.get('/', obtenerProductos );

router.get( '/:id', [
    check( 'id', 'El id ingresado no es válido' ).isMongoId(),
    check( 'id' ).custom( isIDProductoValid ),    

    validarCampos
], obtenerProductosID );

router.post('/',[
    validarJWT,
    check( 'nombre', 'El Nombre es obligatorio' ).notEmpty(),
    check( 'nombre', 'El Nombre no es válido' ).isString().isLength({ min: 2 }),
    check( 'usuario', 'La ID del Usuario no es válida' ).isMongoId(),
    check( 'usuario' ).custom( isIdExist ),
    check( 'categoria', 'La ID no es válida' ).notEmpty().isMongoId(),
    check( 'categoria' ).custom( isIDCategoriaValid ),

    validarCampos
], crearProducto );

router.put('/:id',[ 
    validarJWT,
    check( 'id', 'El id ingresado no es válido' ).isMongoId(),
    check( 'id' ).custom( isIDProductoValid ),

    validarCampos
], modificarProducto);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check( 'id', 'El id ingresado no es válido' ).isMongoId(),
    check( 'id' ).custom( isIDProductoValid ),    

    validarCampos
], eliminarProducto);


export default router;

