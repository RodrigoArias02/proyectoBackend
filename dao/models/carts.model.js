import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    productos: [
        {
            idProducto: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'productos',
             
            },
            quantity: {
                type: Number,
                required: true,
            },
        
        }
    ],
});

//Mismo nombre de coleccion
const carritoModelo = mongoose.model('carritos', cartSchema);

export default carritoModelo;
