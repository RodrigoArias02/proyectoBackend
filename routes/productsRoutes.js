import { Router } from "express";
import ProductManager from "../dao/functionProducts.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ManagerProductsMongoDB } from "../dao/managerProductsMongo.js";
import mongoose from "mongoose";


// Obtén la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let ruta = join(__dirname, "..", "archives", "products.json");


const router = Router();

let productManager = new ProductManager(ruta);
const manager = new ManagerProductsMongoDB();

// Ruta final de respuesta al cliente
router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // let resultado = productManager.getProduct();
  let resultado=await manager.listProducts()

  // si detecta el parametro limit cortara el el arreglo de productos
  if (req.query.limit) {
    resultado = resultado.slice(0, req.query.limit);
  }

  // Envía la respuesta como JSON
  return res.status(200).json(resultado);
});

// Ruta final de respuesta al cliente
router.get("/:pid", async (req, res) => {
  const productId = req.params.pid; // Obtén el id del producto de req.params
  res.setHeader("Content-Type", "application/json");
  // let resultado;
  const idValido = mongoose.Types.ObjectId.isValid(productId)
  if(!idValido){
    return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
  }
  const {status,producto}= await manager.ProductoId(productId)

  // Filtra el resultado por productId si es necesario
  // if (!isNaN(productId)) {
  //   resultado = await productManager.getProductById(parseInt(productId));
  //   if(!resultado){
  //     return res.status(400).json({error:"No se encontro el id"});
  //   }
  // }else{
  //   return res.status(400).json({error:"El id no es numerico"});
  // }

  // Envía la respuesta como JSON
  if(status=="200"){
    return res.status(200).json({producto});
  }else{
    return res.status(400).json({error:"Producto no encontrado"});
  }

});


router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const checkTypes = (value, type) => typeof value === type;
  let {title, description, code, price, status=true, stock, category, thumbnail}=req.body
  thumbnail = Array.isArray(thumbnail) ? thumbnail : [];
  let OK =
  checkTypes(title, 'string') &&
  checkTypes(description, 'string') &&
  checkTypes(code, 'number') &&
  checkTypes(price, 'number') &&
  checkTypes(status, 'boolean') &&
  checkTypes(stock, 'number') &&
  checkTypes(category, 'string') &&
  Array.isArray(thumbnail)
  if(OK==true){
    // const estado=await productManager.addProduct(title,description,code,price,status,stock,category, thumbnail)
    const estado = await manager.ingresarProductos(title,description,code,price,status,stock,category, thumbnail)

    if (estado.status === 201) {
      return res.status(201).json(estado);
    } else {
      return res.status(estado.status).json(estado);
    }
  }else{
    return res.status(400).json({error:"el valor de algunos de los campos no es admitido"});
  }

})

router.put("/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let {pid}=req.params;
  const idValido = mongoose.Types.ObjectId.isValid(pid)
  if(!idValido){
    return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
  }
  // pid=parseInt(pid)
 
  // if(isNaN(pid)){

  //   return res.status(400).json({error:"El id no es un numero"});
  // }
  // const estado= await productManager.updateProduct(pid, req.body)
  const estado = await manager.actualizarProducto(pid,req.body)
  if(estado==true){
    return res.status(200).json({estado});
  }else{
    return res.status(400).json({estado})
  }
})

router.delete("/:pid", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    let { pid } = req.params;
    const idValido = mongoose.Types.ObjectId.isValid(pid)
    if(!idValido){
      return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
    }
    // pid = parseInt(pid);
    // const resultado = await productManager.deletProduct(pid);
 
    const resultado = await manager.deletProduct(pid)

    return res.status(resultado.status).json( resultado );
  } catch (error) {
    return res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
  }
});



export default router;
