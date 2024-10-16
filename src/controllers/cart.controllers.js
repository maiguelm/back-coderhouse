import * as cartServices from "../services/cart.services.js";
import { sendPurchaseEmail } from '../services/email.services.js';

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartServices.getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartServices.createCart();
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

export const getCartById = async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await cartServices.getCartById(idCart);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
    try {
        const { idCart, idProd } = req.params;
        const newProdToCart = await cartServices.addToCart(idCart, idProd);
        if (!newProdToCart) {
            return res.status(404).json({ message: "No se pudo agregar el producto al carrito" });
        }
        return res.status(200).json(newProdToCart);
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req, res) => {
  try {
    const { idCart, idProd } = req.params;
    const updatedCart = await cartServices.removeFromCart(idCart, idProd);
    console.log(updatedCart);
    if (!updatedCart)
      res.json({ message: "No se pudo remover el producto del carrito" });
    res.json({ message: `${idProd} removido del carrito` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    const { idCart } = req.params;
    const cartToDelete = await cartServices.deleteCart(idCart);
    if (!cartToDelete)
      res.status(404).json({ error: "el carrito no pudo ser eliminado" });
    else res.status(200).json({ message: `${cartToDelete} ha sido eliminado` });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = req.body.products;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Productos inválidos" });
    }
    const updCart = await cartServices.updateCart(id, products);
    if (!updCart) {
      return res
        .status(404)
        .json({ message: "No se pudo actualizar el carrito" });
    }
    return res.status(200).json(updCart);
  } catch (error) {
    next(error);
  }
};

export const updateProdQuantity = async (req, res, next) => {
  try {
    const { idCart, idProd } = req.params;
    const { quantity } = req.body;

    console.log(
      `ID del carrito: ${idCart}, ID del producto: ${idProd}, Cantidad: ${quantity}`
    );

    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    const updatedCart = await cartServices.updateProdQuantity(
      idCart,
      idProd,
      quantity
    );
    if (!updatedCart) {
      return res
        .status(404)
        .json({ message: "No se pudo actualizar la cantidad de productos" });
    }
    return res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const { idCart } = req.params;
    const clear = await cartServices.clearCart(idCart);
    if (!clear) {
      return res.status(400).json({ message: "No se encontró el carrito" });
    } else return res.json(clear);
  } catch (error) {
    next(error);
  }
};


export const viewCart = async (req, res, next) => {
  const { idCart } = req.params;
  try {
      const cart = await cartServices.getCartById(idCart);
      if (!cart) {
          return res.status(404).send("Carrito no encontrado");
      }
      console.log(cart);
      res.render("cart", { cart }); 
  } catch (error) {
      next(error);
  }
};

export const purchaseCart = async (req, res) => {
  const { idCart } = req.params;
  const userEmail = req.user.email;

  try {
      const purchaseResult = await cartServices.purchaseCart(idCart, userEmail);
      console.log("Resultado de la compra:", purchaseResult); 

      if (purchaseResult.completed) {
          await sendPurchaseEmail(userEmail, purchaseResult.ticket, purchaseResult.products); 

          return res.render("current", {
              user: req.user,
              ticket: purchaseResult.ticket,
              products: purchaseResult.products,
          });
      } else {
          return res.render("current", {
              user: req.user,
              ticket: null,
              failedProducts: purchaseResult.failedProducts, 
          });
      }
  } catch (error) {
      return res.status(500).send({ error: error.message });
  }
};
