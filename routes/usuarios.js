//Creado en el Capitulo 110 
import { Router } from 'express'
import { check } from 'express-validator';

import { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } from '../controllers/usuarios.js'

import { isEmailExist, isIdExist, isRolValido } from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { isAdminRole } from '../middlewares/validar-roles.js';

const router = Router(); 

router.get( '/', usuariosGet );

router.put( '/:id', [ 
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( isIdExist ),
    check( 'rol' ).custom( isRolValido ),
    
    validarCampos
], usuariosPut );

router.post( '/', [
    //Capitulo 128
    //Estos errores se van almacenando en el req, para ser identificados posteriormente en el controlador
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'correo', 'El correo no es válido' ).isEmail(), 
    check( 'password', 'El password debe ser de más de 6 letras' ).isLength({ min: 6 }),
    check( 'rol' ).custom( isRolValido ),
    check( 'correo' ).custom( isEmailExist ),
    
    validarCampos,
], usuariosPost );

router.delete( '/:id', [
    validarJWT,
    isAdminRole,
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( isIdExist ),

    validarCampos,
], usuariosDelete );


export default router;