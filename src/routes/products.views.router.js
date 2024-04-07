// Importación de Express JS:
import { Router } from "express";
// Creación del Router de Express JS:
const productsViewsRouter = Router();
// Importación del manejador de productos:
import { ProductManager } from "../controllers/productManager.js";
// Llamado de la función de productManager:
const productManager = new ProductManager();

// Ruta GET para renderizar los productos:
productsViewsRouter.get("/", async (request, response) => {
  let { limit = 2, page = 1, sort, query } = request.query;
  try {
    const products = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });
    const productsArray = products.data.map((product) => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });
    response.render("products", {
      products: productsArray,
      currentPage: products.page,
      nextPage: products.nextPage,
      previousPage: products.previousPage,
      hasNextPage: products.hasNextPage,
      hasPreviousPage: products.hasPreviousPage,
      totalPages: products.totalPages,
      query,
      sort,
      limit,
      user: request.session.user,
    });
  } catch (error) {
    console.log("Error al obtener los productos de la base de datos.", error);
    response.status(500).json({ error: "Error al obtener los productos." });
  }
});

// Exportación del router para ser utilizado en la app:
export { productsViewsRouter };
