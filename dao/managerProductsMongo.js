import ProductoModelo from "./models/product.modelo.js";

export class ManagerProductsMongoDB {
  async listProducts(pagina) {
    try {
      let prodPaginate = await ProductoModelo.paginate(
        {},
        { lean: true, limit: 3, page: pagina }
      );
      return prodPaginate;
    } catch (error) {
      console.error("Error al listar productos:", error);
      return null;
    }
  }

  async listProductsAggregate(category, page, direccion) {
    let PAGE_SIZE = 3;
    let aggregatePipeline = [];
    page = parseInt(page);
    try {
      // Agregar etapa de filtración por categoría solo si se proporciona una categoría
      if (category) {
        aggregatePipeline.push({
          $match: { category: { $in: [category] } },
        });
      } else {
        // Agregar una etapa de coincidencia que seleccionará todos los documentos si no hay categoría
        aggregatePipeline.push({
          $match: {},
        });
      }
      aggregatePipeline.push(
        {
          $skip: (page - 1) * PAGE_SIZE,
        },
        {
          $limit: PAGE_SIZE,
        }
      );

      
      // Agregar etapa de ordenación por precio (ascendente o descendente)
      aggregatePipeline.push({
        $sort: { price: direccion === "asc" ? 1 : -1 },
      });

      // Consulta para obtener productos
      let prodCat = await ProductoModelo.aggregate(aggregatePipeline);

      // Consulta para obtener el total de productos
      const totalProducts = await (category
        ? ProductoModelo.countDocuments({ category: { $in: [category] } })
        : ProductoModelo.countDocuments());

      // Calcular información de paginación
      const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      const propiedades = {
        status: 200,
        playload: prodCat,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      };

      return propiedades;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      // Manejar el error según tus necesidades
      const propiedades = {
        status:500,
        playload:[]
      }
    }
  }

  async ingresarProductos(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    try {
      const existe = await ProductoModelo.findOne({ code }).lean();
      if (existe != null) {
        return {
          status: 400,
          error: `El producto con el siguiente código ya existe:`,
        };
      }
      let nuevoProducto = ProductoModelo.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      console.log("creado con exito");
      return {
        status: 201,
        message: "peticion realizada con exito",
        producto: nuevoProducto,
      };
    } catch (error) {
      console.error("Error al añadir el producto:", error);
      return { status: 400, error: "Error al añadir el producto a la BD" };
    }
  }
  async ProductoId(id) {
    try {
      const productoEncontrado = await ProductoModelo.findOne({
        _id: id,
      }).lean();
      return { status: 200, producto: productoEncontrado };
    } catch (error) {
      console.error("Algo salio mal en la busqueda:", error);
      return { status: 400, error: "Algo salio mal en la busqueda" };
    }
  }

  async actualizarProducto(id, nuevasPropiedades) {
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
    let valido = propiedadesQueLlegan.every((propiedad) =>
      propiedadesPermitidas.includes(propiedad)
    );

    if (!valido) {
      return { status: 400, error: "Propiedad Invalida" };
    }

    try {
      // Actualizar un documento
      const result = await ProductoModelo.updateOne(
        { _id: id },
        { $set: nuevasPropiedades }
      );

      // Verificar si se actualizó correctamente
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

  async deletProduct(id) {
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
