import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
// import ProductManager from './functions/functionProducts.js';
import { ManagerProductsMongoDB } from "./dao/managerProductsMongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// let ruta = join(__dirname, "archives", "products.json");

// let productManager = new ProductManager(ruta);
const manager = new ManagerProductsMongoDB();

const app = express();
const PORT = 3000;

// Configuración del motor de vistas
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodssByDefault: true,
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "./public")));
// Rutas
import routerProducts from "./routes/productsRoutes.js";
import routerCart from "./routes/cartRoutes.js";
import routerViews from "./routes/viewsRoutes.js";
import routerViewsChat from "./routes/viewsRoutesChat.js";

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCart);
app.use("/", routerViews);
app.use("/chat", routerViewsChat);

// Ruta principal
app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  // const productos=productManager.getProduct()
  let categoria;
  let productos;
  let direccion;
  let pagina;
  if (req.query.category) {
    categoria = req.query.category;
  }
  if (req.query.pagina) {
    pagina = req.query.pagina;
  } else {
    pagina = 1;
  }
  if (req.query.direccion) {
    direccion = req.query.direccion;
  }
  
  try {
    productos = await manager.listProductsAggregate(
      categoria,
      pagina,
      direccion
    );
    if (productos.status == 200) {
      let {
        playload,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = productos;

      res.status(200).render("home", {
        playload,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        totalPages,
        categoria,
        direccion,
        pagina,
      });
    } else {
      res.status(500).send("Hubo un error");
    }
  } catch (error) {}
});
app.use((req, res, next) => {
  res.status(404).send("La ruta no se encontró");
});

// Iniciar servidor
let serverHttp = app.listen(PORT, () => {
  console.log("Servidor iniciado en el puerto:", PORT);
});

export const io = new Server(serverHttp);

io.on("connection", (socket) => {
  console.log(`Se conecto el cliente ${socket.id}`);
  socket.on("producto", (datos) => {
    io.emit("NuevoProducto", datos);

    console.log("emitiendo desde el servidor:");
  });
  //escuchamos que viene el array nuevo
  socket.on("ProductoEliminado", (datos) => {
    //emitimos al cliente para que lo escuche y luego haga el render
    io.emit("nuevoProductoEliminado", datos);

    console.log("emitiendo desde el servidor:");
  });
});
try {
  await mongoose.connect(
    "mongodb+srv://Rodrigo:terremoto@cluster0.ycruuxq.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "ecommerce" }
  );
  console.log("DB Online");
} catch (error) {
  console.log(error);
}
