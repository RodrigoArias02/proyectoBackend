import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  
},
{
    timestamps:true,
    strict:true
}
);

//Mismo nombre de coleccion
const chatModelo = mongoose.model('messages', chatSchema);

export default chatModelo;
