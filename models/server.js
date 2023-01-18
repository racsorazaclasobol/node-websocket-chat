import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors'
import { Server as socketServer } from 'socket.io'
import { createServer } from 'http';

import { socketController } from '../sockets/socketController.js'
import { AuthRouter, UsuarioRouter, CategoriaRouter, ProductoRouter, BuscarRouter, UploadRouter } from '../routes/index.js'

import { dbConnection } from '../database/config.js';


class Server {

    constructor() {
        this.app = express();
		this.port = process.env.PORT || 3000;
		this.server = createServer( this.app );
		this.io = new socketServer( this.server );

		//Base de datos
		this.conectarDB();

		//Rutas
		this.rutasPath = {
			authPath: '/api/auth',
			buscarPath: '/api/buscar',
			usuarioPath: '/api/usuarios',
			categoriaPath: '/api/categorias',
			productoPath: '/api/productos',
			uploadPath: '/api/upload',
		};

		//Middlewares
		this.middlewares();

		//Rutas de la aplicación
		this.routes();

		//Sockets
		this.sockets();
    }

	middlewares() {
		//CORS
		this.app.use(cors())

		// Lectura y Parseo del Body
		this.app.use( express.json() );

		//Directorio público
		this.app.use( express.static('public') )

		//Manejo de Carga de Archivos
		this.app.use(fileUpload({
			useTempFiles : true,
			tempFileDir : '/tmp/',
			createParentPath: true,
		}));
	}

    routes() {
		
		const { authPath, buscarPath, usuarioPath, categoriaPath, productoPath, uploadPath } = this.rutasPath;

		this.app.use( authPath, AuthRouter );
		this.app.use( buscarPath, BuscarRouter )
		this.app.use( usuarioPath, UsuarioRouter );
		this.app.use( categoriaPath, CategoriaRouter );
		this.app.use( productoPath, ProductoRouter );
		this.app.use( uploadPath, UploadRouter );
        
    }

	sockets(){
		this.io.on("connection", ( socket ) => socketController( socket, this.io ) );
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log("Servidor corriendo en puerto: ", this.port)
		})
	}

	async conectarDB(){
		await dbConnection();
	}

}

export default Server;