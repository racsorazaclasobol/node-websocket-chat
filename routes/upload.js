import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarImagenClouinary, cargarArchivos, mostrarImagenes } from '../controllers/upload.js';

import { coleccionesPermitidas } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarArchivo } from '../middlewares/valirdar-archivos.js';

const router = Router(); 


router.post( '/', [], cargarArchivos )

router.put( '/:coleccion/:id', [
    validarArchivo,
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),

    validarCampos
], actualizarImagenClouinary )
// ], actualizarImagen )

router.get( '/:coleccion/:id', [
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),

    validarCampos
], mostrarImagenes )



export default router;