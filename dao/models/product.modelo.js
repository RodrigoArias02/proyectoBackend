import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: [String], // Puede ser un array de strings si hay múltiples thumbnails
  },
});
productoSchema.plugin(paginate)
//Mismo nombre de coleccion
const ProductoModelo = mongoose.model('productos', productoSchema);

export default ProductoModelo;
