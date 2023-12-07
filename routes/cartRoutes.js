import { Router } from 'express';
import mongoose from 'mongoose';
import { ManagerCartMongoDB } from '../dao/managerCartsMongo.js';
import { ManagerProductsMongoDB } from '../dao/managerProductsMongo.js';
// import CartManager from '../functions/functionCart.js';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// // Obtén la ruta del archivo actual
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// let ruta = join(__dirname, "..", "archives", "products.json");


const router = Router();

// let cartManager = new CartManager(ruta);

const manager = new ManagerCartMongoDB();
const managerProduct = new ManagerProductsMongoDB();

router.get("/",  async(req, res) => {
  res.setHeader("Content-Type", "application/json");
  const carritos= await manager.listCart()
  return res.status(201).json({carritos});
})

router.post("/", async(req, res) => {
  res.setHeader("Content-Type", "application/json");

  // const validacion = cartManager.CreateCart();
  const validacion = manager.createCart()
  if (validacion) {
    return res.status(201).json("Carrito creado con exito");
  } else {
    return res.status(400).json("No se pudo crear el carrito");
  }
});

router.get("/:cid", async (req, res) => {
  const productId = req.params.cid; // Obtén el id del producto de req.params
  res.setHeader("Content-Type", "application/json");

    const {status,carrito} = await manager.cartId(productId);
    if (status==200) {
      return res.status(200).json({ carrito });
    
    }else if(status==400){
      return res.status(400).json({ error: "No se encontro el id" });
    }else{
      return res.status(500).json({ error: "Hubo un error" });
    }
  
});

router.post("/:cid/product/:pid", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
  const productId = req.params.pid; // Obtén el id del producto de req.params
  const cartId = req.params.cid; // Obtén el id del producto de req.params

  const validacion = await managerProduct.ProductoId(productId)
  if (validacion.status != 200) {
    return res.status(400).json(validacion.error);
  }
  let formProduct = {
    idProducto: validacion.producto._id,
    quantity: 1
  };
 
 
  const agregarProducto= await manager.addProductToCart(cartId,formProduct)
  return res.status(200).json(agregarProducto);
});
export default router;
