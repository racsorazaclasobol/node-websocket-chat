import { Schema, model } from 'mongoose';

const ProductoSchema = Schema({

    nombre:{
        type: String,
        require: [true, 'El Nombre es obligatorio'],
        unique: true,
    },
    estado:{
        type: Boolean,
        default: true,
        require: true,
    },
    precio: {
        type: Number,
        default: 0
    },
    descripcion:{
        type: String,
        default: ''
    },
    disponible:{
        type: Boolean,
        default: true
    },
    img:{
        type: String
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true,
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    }

})

ProductoSchema.methods.toJSON = function() {

    const { __v, _id, ...data } = this.toObject(); //Lo que hago es desestructurar los valores que no quiero devolver, y el conjunto de los que sobran que si quiero devolver

    data.id = _id;

    return data; 

}


export default model( 'Producto', ProductoSchema );
 