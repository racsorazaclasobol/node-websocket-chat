import { Schema, model } from 'mongoose';

const CategoriaSchema = Schema({

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
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    }

})

CategoriaSchema.methods.toJSON = function() {

    const { __v, estado, _id, ...data } = this.toObject(); //Lo que hago es desestructurar los valores que no quiero devolver, y el conjunto de los que sobran que si quiero devolver

    data.id = _id;

    return data; 

}


export default model( 'Categoria', CategoriaSchema );
 