import express from 'express';
import { ManagerProductsMongoDB } from '../dao/managerProductsMongo.js';
import { ManagerCartMongoDB } from '../dao/managerCartsMongo.js';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import ProductManager from '../functions/functionProducts.js';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// let ruta = join(__dirname, "..", "archives", "products.json");
// let productManager = new ProductManager(ruta);

const manager = new ManagerProductsMongoDB();
const managerC = new ManagerCartMongoDB();
const router = express();

// Ruta principal
router.get("/ingresarProductos", async (req, res) => {
    // let productos=productManager.getProduct()
    const productos = await manager.listProducts()
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realTimesProducts', { productos: productos.docs});

});
router.get("/productos", async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    let pagina=1;
  
    if(req.query.pagina){
        pagina=req.query.pagina
    }

    let productos
    try {
            productos = await manager.listProducts(pagina); 
    } catch (error) {}
    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = productos;
    res
    .status(200)
    .render("productos", {
      productos: productos.docs,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      totalPages,
    });

});

router.get("/carts/:cid", async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const productId = req.params.cid; // Obtén el id del producto de req.params
   
  
      const {status,carrito} = await managerC.cartId(productId);
 
      if (status==200) {
        const productosCarritos=carrito.productos
        console.log(productosCarritos)
        res.status(200).render("cart", {productosCarritos});
      
      }else if(status==400){
        return res.status(400).json({ error: "No se encontro el id" });
      }else{
        return res.status(500).json({ error: "Hubo un error" });
      }
    
  });
  
export default router