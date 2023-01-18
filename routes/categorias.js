import { Router } from 'express'
import { check } from 'express-validator';

import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategorias, obtenerCategoriasId } from '../controllers/categorias.js';
import { isExistCategoria, isIDCategoriaValid } from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { isAdminRole } from '../middlewares/validar-roles.js';


const router = Router();

router.get('/', obtenerCategorias);

router.get( '/:id', [  
    check( 'id', 'El id ingresado no es válido' ).isMongoId(),
    check( 'id' ).custom( isIDCategoriaValid ),
    validarCampos,
], obtenerCategoriasId );

router.post('/', [ 
        validarJWT,
        check( 'nombre', 'El Nombre es obligatorio.' ).not().isEmpty(),

        validarCampos            
    ], crearCategoria 
);

router.put('/:id', [
    validarJWT,
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( isIDCategoriaValid ),
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'nombre' ).custom( isExistCategoria ),

    validarCampos
], actualizarCategoria );

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check( 'id', 'La id no es válida' ).isMongoId(),
    check( 'id' ).custom( isIDCategoriaValid ),

    validarCampos
], borrarCategoria);


export default router;

