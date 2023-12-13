import carritoModelo from "./models/carts.model.js";

export class ManagerCartMongoDB {
  async listCart() {
    try {
      let carritos = await carritoModelo.find();
      return carritos;
    } catch (error) {
      console.error("Error al listar productos:", error);
      return null;
    }
  }

  async createCart() {
    try {
      let nuevoCarrito = carritoModelo.create({});
      console.log("creado con exito");
      return {
        status: 201,
        message: "peticion realizada con exito",
        producto: nuevoCarrito,
      };
    } catch (error) {
      console.error("Error al añadir el producto:", error);
      return { status: 400, error: "Error al añadir el producto a la BD" };
    }
  }

  async cartId(id) {
    try {
    const cartSearch = await carritoModelo.findOne({ _id: id }).populate("productos.idProducto");
      console.log(cartSearch)
    if (!cartSearch) {
      // El carrito no fue encontrado
      console.log("carrito no encontrado")
      return { status: 404, error: "Carrito no encontrado" };
    }
    console.log("carrito encontrado")
    return { status: 200, carrito: cartSearch };
    } catch (error) {
      console.error("Algo salio mal en la busqueda:", error);
      return { status: 400, error: "Algo salio mal en la busqueda" };
    }
  }

  async addProductToCart(idCart, nuevasPropiedades) {
    const propiedadesPermitidas = ["idProducto", "quantity"];
    let propiedadesQueLlegan = Object.keys(nuevasPropiedades);
    let valido = propiedadesQueLlegan.every((propiedad) =>
      propiedadesPermitidas.includes(propiedad)
    );
    if (!valido) {
      return { status: 400, error: "Propiedad Invalida" };
    }
    let { carrito } = await this.cartId(idCart);
    let productoAnterior = carrito.productos;

    try {
      const result = await carritoModelo.findOne({
        _id: idCart,
        productos: { $elemMatch: { idProducto: nuevasPropiedades.idProducto } },
      });

      if (result) {
        return {
          status: 404,
          error: "el producto ya esta ingresado en el carrito",
        };
      }
    } catch (error) {
      console.error("Error al buscar el documento:", error);
    }

    if (carrito.productos.length > 0) {
      productoAnterior.push(nuevasPropiedades);
    } else {
      productoAnterior = nuevasPropiedades;
    }
    try {
      const result = await carritoModelo.updateOne(
        { _id: idCart },
        { productos: productoAnterior }
      );
      //   Verificar si se actualizó correctamente
      if (result.modifiedCount === 1) {
        console.log("Documento actualizado con éxito");
        return { status: 200, message: "Documento actualizado con éxito" };
      } else {
        console.log("No se encontró el documento o no hubo cambios");
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      return {
        status: 500,
        error: `Error al actualizar el documento: ${error}`,
      };
    }
  }

  async updateQuantity(idCart, idProduct, quantity) {
    try {
      // Actualizamos el carrito usando $pull

      const quantityUpdateResult = await carritoModelo.updateOne(
        { _id: idCart, "productos.idProducto": idProduct },
        { $set: { "productos.$.quantity": quantity.quantity } }
      );
      if (quantityUpdateResult.modifiedCount === 1) {
        return { status: 200, message: "Cantidad actualizada con éxito" };
      } else {
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }

  async updateProducts(cartId, arrayProducts) {
    try {
      const updateResult = await carritoModelo.updateOne(
        { _id: cartId },
        { $set: { productos: arrayProducts } }
      );
      if (updateResult.modifiedCount === 1) {
        console.log("if")
        return { status: 200, message: "Productos actualizada con éxito" };
      } else {
        console.log("else")
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }
  
  async deleteProductCart(idCarrito, idProductoAEliminar) {
    try {
      // Actualizamos el carrito usando $pull
      const deleteResult = await carritoModelo.updateOne(
        { _id: idCarrito },
        { $pull: { productos: { idProducto: idProductoAEliminar } } }
      );
      if (deleteResult.modifiedCount === 1) {
        return { status: 200, message: "Producto eliminado con exito" };
      } else {
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }

  async deletTotalProductCart(id) {
    try {
      const result = await carritoModelo.updateOne(
        { _id: id },
        { productos: [] }
      );
      //   Verificar si se actualizó correctamente
      if (result.modifiedCount === 1) {
        return {
          status: 200,
          message: "Se eliminaron los productos del carrito",
        };
      } else {
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {}
  }

  async deletCart(id) {
    try {
      // Validar si el ID proporcionado es válido

      if (!id) {
        return {
          status: 400,
          message: "Se requiere un ID válido para eliminar el producto.",
        };
      }

      // Intentar eliminar el documento
      const result = await ProductoModelo.deleteOne({ _id: id });

      // Verificar si se eliminó correctamente
      if (result.deletedCount === 1) {
        console.log(result.title);
        return { status: 201, message: "Producto eliminado con éxito." };
      } else {
        return {
          status: 404,
          message: "No se encontró el producto con el ID proporcionado.",
        };
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return {
        status: 500,
        message: "Error interno al intentar eliminar el producto.",
      };
    }
  }
}
