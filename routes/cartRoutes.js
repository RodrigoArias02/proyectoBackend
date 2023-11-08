const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const CartManager = require("../functions/functionCart");

let ruta = path.join(__dirname, "..", "archives", "carts.json");

const router = Router();

let cartManager = new CartManager(ruta);
router.get("/",  (req, res) => {
  productId = req.params.cid; // Obtén el id del producto de req.params
  res.setHeader("Content-Type", "application/json");
  return res.status(201).json("aqui no hay nada");
})
router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const validacion = cartManager.CreateCart();
  if (validacion) {
    return res.status(201).json("Carrito creado con exito");
  } else {
    return res.status(400).json("No se pudo crear el carrito");
  }
});

router.get("/:cid", async (req, res) => {
  productId = req.params.cid; // Obtén el id del producto de req.params
  res.setHeader("Content-Type", "application/json");
  let resultado;

  if ((productId != "") | (productId != undefined)) {
    productId = parseInt(productId);
  }else{
    return res.status(400).json({ error: "Ingrese un id" });
  }

  // Filtra el resultado por productId si es numerico
  if (!isNaN(productId)) {
    resultado = await cartManager.getCartId(productId);
    if (!resultado) {
      return res.status(400).json({ error: "No se encontro el id" });
    }
  } else {
    return res.status(400).json({ error: "El id no es numerico" });
  }

  // Envía la respuesta como JSON

  resultado = resultado.productos;
  return res.status(200).json({ resultado });
});

router.post("/:cid/product/:pid", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
  productId = req.params.pid; // Obtén el id del producto de req.params
  cartId = req.params.cid; // Obtén el id del producto de req.params
  if (
    (productId != "") | (cartId != undefined) &&
    (productId != "") | (cartId != undefined)
  ) {
    productId = parseInt(productId);
    cartId = parseInt(cartId);
  }
  const validacion = await cartManager.addProductToCart(cartId, productId);
  console.log(validacion)
  if (validacion == "El id del producto no se encuentra disponible") {
    return res.status(400).json(validacion);
    
  }
  return res.status(201).json(validacion);
});
module.exports = router;
