import { Schema, model } from 'mongoose';

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [ true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es obligatoria' ],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: [ 'ADMIN_ROLE', 'USER_ROLE' ]
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        required: false
    }

});

//Capitulo 131 - Para modificar el metodo nativo de mongoose y decirle que no devuelva la contraseña despues de crear el usuario
UsuarioSchema.methods.toJSON = function() {

    const { __v, password, _id, ...usuario } = this.toObject(); //Lo que hago es desestructurar los valores que no quiero devolver, y el conjunto de los que sobran que si quiero devolver

    usuario.uid = _id;

    return usuario; 

}


export default model( 'Usuario', UsuarioSchema );
 