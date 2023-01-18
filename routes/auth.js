import { Router } from 'express';
import { check } from 'express-validator';

import { authLogin, googleSignIn, validarToken } from '../controllers/auth.js';
import { isLoginValid } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router(); 

router.get( '/', validarJWT, validarToken )

router.post( '/login', [
    check( 'correo', 'El correo es obligatorio' ).isEmail(),
    check( 'correo' ).custom( isLoginValid ) ,
    check( 'password', 'La contraseña es obligatoria' ).notEmpty(),
    
    validarCampos,
], authLogin );

router.post( '/google', [
    check( 'id_token', 'El id_token es obligatorio' ).notEmpty(),

    validarCampos,
], googleSignIn );



export default router;