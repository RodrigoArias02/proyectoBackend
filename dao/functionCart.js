import fs from 'fs'
import ProductManager from "./functionProducts.js";
import path from 'path';


class CartManager {
  constructor(ruta) {
    this.path = ruta;
    this.carts = [];
  }
  async CreateCart() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      let id = 1;
      if (data != "") {
        this.carts = JSON.parse(data);
      }

      if (this.carts.length > 0) {
        id = this.carts[this.carts.length - 1].id + 1;
      }
      let repeat = this.carts.some((cart) => cart.id === id);

      if (repeat) {
        console.log(`El código ${id} ya existe en la lista.`);
        return;
      }
      let objectCart = {
        id: id,
        productos: [],
      };
      this.carts.push(objectCart);
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
      return true
    } catch (error) {
      return false;
    }
  }
  async getCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      const arrayCarts = data !== "" ? JSON.parse(data) : "";
      return arrayCarts;
    } catch (error) {
      return [];
    }
  }
  async getCartId(idBuscar) {
    try {
      const arrayCarts = await this.getCarts();
      const searchCart = arrayCarts.find((cart) => cart.id === idBuscar);
      return searchCart;
    } catch (error) {
      return [];
    }
  }
  async addProductToCart(idCart, idProduct) {
    let ruta = path.join(__dirname, "..", "archives", "products.json");
    let productManager = new ProductManager(ruta);
    let productosDisponibles = await productManager.getProduct();
    this.carts = await this.getCarts();
    const cartModify = await this.getCartId(idCart);
    const indice = this.carts.findIndex((cart) => cart.id == idCart);
    let found = false; // Variable para guardar si se encuentra coincidencia
    // Verificamos si el ID buscado coincide con alguno de los IDs de los productos en el array
    found = productosDisponibles.some((producto) => producto.id == idProduct);
    if (found) {
      if (cartModify != "") {
        //guardamos solos las propiedades Productos
        let productos = cartModify.productos;
        const repeated = productos.find((product) => product.id === idProduct);
        if (repeated == undefined) {
          const objectProduct = {
            id: idProduct,
            quantity: 1,
          };
          productos.push(objectProduct);
          this.carts[indice].productos = productos;
    
          fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
          return "Se añado u nuevo producto";
        } else {
          const indiceProducto = this.carts[indice].productos.findIndex(
            (producto) => producto.id == idProduct
          );

          let modificarQ={
            id:idProduct,
            quantity:cartModify.productos[indiceProducto].quantity+1
          }
     
          let newArray = this.carts[indice].productos.map(objeto => objeto.id === modificarQ.id ? modificarQ : objeto);
          
          this.carts[indice].productos = newArray;
          fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
          return "Ya existia el producto, se sumo uno mas"
        }
      }
    } else {
      console.log("id no encontrado");
      return "El id del producto no se encuentra disponible";
    }
  }
}

export default CartManager;
