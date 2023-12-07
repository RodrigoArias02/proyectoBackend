import express from 'express';
import { ManagerChatMongoDB } from '../dao/managerChatMongo.js';
import moment from 'moment';
import { io } from '../app.js';

const manager = new ManagerChatMongoDB();
const time = moment().format('HH:mm');
const router = express();

function formatearHora(messages){
  messages.map(message => {
    message.formattedCreatedAt = moment(message.createdAt).format('HH:mm');
    return message;
  });
  return messages
}
// Ruta principal
router.get("/", async (req, res) => {
    try {
      let messages = await manager.loadChat();
  
      // Formatear la hora de cada mensaje antes de pasarlos a la plantilla
      messages = formatearHora(messages)

      res.setHeader('Content-Type', 'text/html');
      res.status(200).render('chat', { messages });
    } catch (error) {
      console.error('Error al cargar el chat:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

router.post("/", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    
    const checkTypes = (value, type) => typeof value === type;
    let {user, message}=req.body

    let OK = checkTypes(user, 'string') && checkTypes(message, 'string') 
    if(OK==true){
      const estado = await manager.saveMessages(user, message)
  
      if (estado.status === 201) {
        io.emit("nuevoMensaje",user,message,time)
        return res.status(201).json(estado);
      } else {
        return res.status(estado.status).json(estado);
      }
    }else{
      return res.status(400).json({error:"el valor de algunos de los campos no es admitido"});
    }
  
  })

  export default router

