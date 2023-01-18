import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const validDefaultExt = ['png', 'jpg', 'jpeg', 'gif']; 

const subirArchivo = ( files, extensionesValidas = validDefaultExt, carpeta = '' ) => { //Clase 196

    return new Promise( ( resolve, reject ) => {
        
        const { archivo } = files;
    
        const nombreCortado = archivo.name.split( '.' );
        const extension = nombreCortado[ nombreCortado.length - 1 ];
    
        if( !extensionesValidas.includes( extension ) ) return reject( `La extensió ${extension} no es permitida.`);
    
        const nombreTemp = `${ uuidv4() }.${ extension }`;
    
        const uploadPath = path.join( __dirname, '../uploads/', carpeta,  nombreTemp );
      
        archivo.mv(uploadPath, (err) => {
          if (err) reject( err );
      
          resolve( nombreTemp );
        });    

    } );



}

export { 
    subirArchivo 
}