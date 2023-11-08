const fs = require("fs");
class ProductManager {
  constructor(ruta) {
    this.path = ruta;
    this.products = [];
  }
  getProduct() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return data !== '' ? JSON.parse(data) : '';
    } catch (error) {
      return [];
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    let products = await this.getProduct();
    let id = 1;
    if (products.length > 0) {
      id = products[products.length - 1].id + 1;
    }

    //miramos si hay repetidos con el metodo some(true/false)
    let repeat = products.some((product) => product.id === id);

    if (!title || !description || !price || stock === undefined) {
      console.log(
        `el producto no se pudo crear debido a que faltaron rellenar algunos campos`
      );

      return;
    }
    if (repeat) {
      console.log(`El código ${id} ya existe en la lista.`);
      return;
    }
    const product = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };
    products.push(product);
    fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
  }

  async getProductById(idBuscar) {
    //con el metodo find buscamos por el id, devuelve el producto que coincida
    const products = await this.getProduct();
    let foundProduct = products.find((product) => product.id === idBuscar);
    if (foundProduct) {
      console.log(`producto con ID ${idBuscar} encontrado con exito`);
      console.log(foundProduct);
      return foundProduct;
    } else {
      console.log(`Producto con ID ${idBuscar} no encontrado.`);
      return false;
    }
  }

  async updateProduct(id, nuevasPropiedades) {
    let product = await this.getProductById(id);

    if (product != false) {
      let products = await this.getProduct();
      let productIndex = products.findIndex((producto) => producto.id === id);
      if (productIndex === -1) {
        return "No se encontro el id del producto";
      }
      const propiedadesPermitidas = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
        "thumbnails",
      ];
      let propiedadesQueLlegan = Object.keys(nuevasPropiedades);
      let valido = propiedadesQueLlegan.every((propiedades) =>
        propiedadesPermitidas.includes(propiedades)
      );
      if (!valido) {
        return "Propiedad Invalida";
      }

      let productoModificado = {
        ...product,
        ...nuevasPropiedades,
        id,
      };
      products[productIndex] = productoModificado;
      fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
      console.log("Actualizado con exito");
      console.log(product);
      return true;
    } else {
      return "no se encontro el producto";
    }
  }
  async deletProduct(id) {
    let products = await this.getProduct();
    let verificacion = await this.getProductById(id);
    if (!verificacion) {
      return { status: 400, message: "No se encuentra el id ingresado" };
    }

    //si ibjeto.id es diferente a id se incluira en el nuevo array ese objeto
    products = products.filter((objeto) => objeto.id !== id);
    fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
    return { status: 200, message: "Eliminado con éxito" };
  }
}

module.exports = ProductManager;
