import chatModelo from "./models/chat.modelo.js";
export class ManagerChatMongoDB {
    async loadChat() {
        try {
            let data= await chatModelo.find();
            return data
        } catch (error) {
            console.error("Error al listar productos:", error);
            return null
        }
    }

    async saveMessages(user,message){
        
        try {
            let newMessage = chatModelo.create({user,message})
            console.log("creado con exito")
            return { status: 201, message:"peticion realizada con exito", message:newMessage};
            
        } catch (error) {
            console.error("Error al añadir el producto:", error);
            return { status: 400, error: "Error al añadir el producto a la BD" };
        } 
    }
    

}





