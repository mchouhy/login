// Importación del Router de Express JS:
import { Router } from "express";
// Importación del manejador de carts:
import { CartManager } from "../../controllers/cartManager.js";
// Creación del Router de Carts:
const cartsApiRouter = Router();
// Llamado de la función constructora:
const cartManager = new CartManager();
// Importación del model de carts:
import { cartModel } from "../../models/carts.model.js";

// Rutas de carts:
// Post que crea un nuevo cart:
cartsApiRouter.post("/", async (request, response) => {
  try {
    const newCart = await cartManager.createCart();
    response.json(newCart);
  } catch (error) {
    response.status(500).json({ error: "Error al crear el cart." });
  }
});

// Get que lista los productos que pertenezcan al cart por id:
cartsApiRouter.get("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      console.log("No existe un cart con el id ingresado.", error);
      return response
        .status(404)
        .json({ error: "Cart por id ingresado no existe." });
    }
    return response.json(cart.products);
  } catch (error) {
    response.status(500).json({
      error: "Error. No se pudo obtener el producto del cart por id.",
    });
  }
});

// Post que agrega como objeto el producto al array de products del cart seleccionado:
cartsApiRouter.post("/:cid/product/:pid", async (request, response) => {
  const cartId = request.params.cid;
  const prodId = request.params.pid;
  const quantity = request.body.quantity || 1;
  try {
    const updateCart = await cartManager.addProduct(cartId, prodId, quantity);
    response.json(updateCart.products);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Error. No se pudo agregar el producto" });
  }
});

// Delete que elimina un producto del cart:
cartsApiRouter.delete("/:cid/product/:pid", async (request, response) => {
  const cartId = request.params.cid;
  const prodId = request.params.pid;
  try {
    const updateCart = await cartManager.deleteProduct(cartId, prodId);
    response.json({
      status: "success",
      message: "Producto eliminado con éxito.",
      updateCart,
    });
  } catch (error) {
    console.log("Error al eliminar el producto del cart", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// Put que actualiza products en el cart:
cartsApiRouter.put("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  // Se envía un array de productos en el body de la solicitud:
  const updatedProducts = request.body;
  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    response.json(updatedCart);
  } catch (error) {
    console.log("Error al actualizar el cart", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// Put que actualiza la cantidad de productos en el cart:
cartsApiRouter.put("/:cid/product/:pid", async (request, response) => {
  const cartId = request.params.cid;
  const prodId = request.params.pid;
  const newQuantity = request.body.quantity;
  try {
    const updatedCart = await cartManager.updateProductQuantity(
      cartId,
      prodId,
      newQuantity
    );
    response.json({
      status: "success",
      message: "Cantidad del producto actualizada con éxito.",
      updatedCart,
    });
  } catch (error) {
    console.log("Error al actualizar la cantidad de productos el cart.", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor.",
    });
  }
});

// Delete que vacía el cart:
cartsApiRouter.delete("/:cid", async (request, response) => {
  const cartId = request.params.cid;
  try {
    const updatedCart = await cartManager.emptyCart(cartId);
    response.json({
      status: "success",
      message: "Se eliminaron con éxito los productos del cart.",
      updatedCart,
    });
  } catch (error) {
    console.log("Error al intentar vaciar el cart.", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// Exportación del router de carts para utilizarlo desde app.js:
export { cartsApiRouter };
