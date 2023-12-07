import fs from 'fs';
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

  async addProduct(title,description,code,price,status,stock,category,thumbnail) {
    let products = await this.getProduct();
    let id = 1;
    if (products.length > 0) {
      id = products[products.length - 1].id + 1;
    }

    //miramos si hay repetidos con el metodo some(true/false)
    let repeat = products.some((product) => product.id === id);
    const regex = /\d/;
    const titleValidation= !regex.test(title);
    const descriptionValidation= !regex.test(description);
    if(descriptionValidation==false || titleValidation==false){
      return { status: 400, error: "Campo de titulo o descripcion contienen numeros" };
    }
   
    if (!title || !description || !price || stock === undefined) {
      return { status: 400, error: "Campos obligatorios faltantes o incorrectos" };
    }
    if (repeat) {
      return { status: 400, error: "Hubo un error, se repitio ID"  };
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
    return { status: 201, message:"peticion realizada con exito"  };
  }

  async getProductById(idBuscar) {
    //con el metodo find buscamos por el id, devuelve el producto que coincida
    const products = await this.getProduct();
    let foundProduct = products.find((product) => product.id === idBuscar);
    if (foundProduct) {
      console.log(`producto con ID ${idBuscar} encontrado con exito`);
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
        "thumbnail",
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

      return true;
    } else {
      return "no se encontro el producto";
    }
  }
  async deletProduct(id) {
    let products = await this.getProduct();
    let verificacion = await this.getProductById(id);
    if (verificacion==false) {
      return { status: 404, message: "No se encuentra el id ingresado" };
    }

    //si ibjeto.id es diferente a id se incluira en el nuevo array ese objeto
    products = products.filter((objeto) => objeto.id !== id);
    fs.writeFileSync(this.path, JSON.stringify(products, null, "\t"));
    return { status: 201, message: "Eliminado con éxito" };
  }
}

export default ProductManager;
