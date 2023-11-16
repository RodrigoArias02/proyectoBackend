import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ProductManager from '../functions/functionProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let ruta = join(__dirname, "..", "archives", "products.json");
let productManager = new ProductManager(ruta);

const router = express();

// Ruta principal
router.get("/", (req, res) => {
    let productos=productManager.getProduct()
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('realTimesProducts', {productos});

});


export default router