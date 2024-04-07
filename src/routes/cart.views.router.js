// Importación de Express JS:
import { Router } from "express";
// Creación del Router de Express JS:
const cartViewsRouter = Router();
// Importación del manejador de carts:
import { CartManager } from "../controllers/cartManager.js";
// Llamado de la función de cartManager:
const cartManager = new CartManager();

// Ruta GET para renderizar el cart por id:
cartViewsRouter.get("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);
    const cartData = cart.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));
    response.render("carts", { cartproducts: cartData });
  } catch (error) {
    console.log("Error en el servidor al buscar el cart por id", error);
    response
      .status(500)
      .json({ error: "Error en el servidor al intentar obtener el cart." });
  }
});

// Exportación del router para ser utilizado en la app:
export { cartViewsRouter };
