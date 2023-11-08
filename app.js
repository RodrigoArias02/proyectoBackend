const express=require('express')
const routerUsuarios=require('./routes/productsRoutes')
const routerCart=require("./routes/cartRoutes")

const PORT=3000

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//todo lo que llegue de esa ruta lo atiende el archivo "productsRoutes"
app.use('/api/products', routerUsuarios)
app.use('/api/carts', routerCart)

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send('OK')
});
  
app.listen(PORT, () => {
    console.log("Servidor iniciado en el puerto:", PORT);
  });
  