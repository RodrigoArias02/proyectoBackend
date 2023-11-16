import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import ProductManager from './functions/functionProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let ruta = join(__dirname, "archives", "products.json");

let productManager = new ProductManager(ruta);

const app = express();
const PORT = 3000;

// Configuración del motor de vistas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname,"./public")))
// Rutas
import routerUsuarios from './routes/productsRoutes.js';
import routerCart from './routes/cartRoutes.js';
import routerViews from './routes/viewsRoutes.js'

app.use('/api/products', routerUsuarios);
app.use('/api/carts', routerCart);
app.use('/realtimeproducts', routerViews)

// Ruta principal
app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const productos=productManager.getProduct()
    console.log(productos)
    res.status(200).render('home', {productos});

});
app.use((req, res, next) => {
    res.status(404).send("La ruta no se encontró");
  });




// Iniciar servidor
let serverHttp=app.listen(PORT, () => {
    console.log("Servidor iniciado en el puerto:", PORT);
});

const io=new Server(serverHttp)

io.on("connection",socket=>{
    console.log(`Se conecto el cliente ${socket.id}`)
    socket.on('producto', datos=>{
        io.emit('NuevoProducto', datos)

        console.log("emitiendo desde el servidor:")

    })
    //escuchamos que viene el array nuevo
    socket.on('ProductoEliminado', datos=>{
        //emitimos al cliente para que lo escuche y luego haga el render
        io.emit('nuevoProductoEliminado', datos)

        console.log("emitiendo desde el servidor:")

    })
})