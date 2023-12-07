import express from 'express';
import { ManagerProductsMongoDB } from '../dao/managerProductsMongo.js';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import ProductManager from '../functions/functionProducts.js';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// let ruta = join(__dirname, "..", "archives", "products.json");
// let productManager = new ProductManager(ruta);

const manager = new ManagerProductsMongoDB();

const router = express();

// Ruta principal
router.get("/", async (req, res) => {
    // let productos=productManager.getProduct()
    const productos = await manager.listProducts()
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realTimesProducts', {productos});

});



export default router