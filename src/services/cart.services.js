import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongoDB();

import ProductDaoMongoDB from "../daos/mongodb/products.dao.js";
const productDao = new ProductDaoMongoDB();

import { sendPurchaseEmail } from "../services/email.services.js"

export const getAllCarts = async () => {
  try {
    return await cartDao.getAllCarts();
  } catch (error) {
    throw new Error(error);
  }
};

export const createCart = async () => {
  try {
    return await cartDao.createCart();
  } catch (error) {
    throw new Error(error);
  }
};

export const getCartById = async (idCart) => {
  try {
    return await cartDao.getCartById(idCart);
  } catch (error) {
    throw new Error(error);
  }
};

export const addToCart = async (idCart, idProd) => {
  try {
    let cart = await cartDao.getCartById(idCart);
    if (!cart) {
      cart = await cartDao.createCart();
    }

    const product = await productDao.getProductById(idProd);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const updatedCart = await cartDao.addToCart(cart._id, idProd);

    const totalQuantity = updatedCart.products.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    return { updatedCart, totalQuantity };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeFromCart = async (idCart, idProd) => {
  try {
    const existCart = await cartDao.getCartById(idCart);
    if (!existCart) return null;

    const existProd = await cartDao.existProdInCart(idCart, idProd);
    if (!existProd) return null;

    return await cartDao.removeFromCart(idCart, idProd);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCart = async (idCart) => {
  try {
    const cartToDelete = await cartDao.deleteCart(idCart);
    console.log(cartToDelete);
    if (!cartToDelete) {
      return false;
    } else return cartToDelete;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCart = async (idCart, products) => {
  try {
    const existCart = await cartDao.getCartById(idCart);
    if (!existCart) {
      console.log("Carrito no encontrado");
      return null;
    }

    for (const product of products) {
      const productInDb = await productDao.getProductById(product.idProd);
      if (!productInDb) {
        throw new Error(`Producto con ID ${product.idProd} no encontrado`);
      }
    }

    return await cartDao.updateCart(idCart, products);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateProdQuantity = async (idCart, idProd, quantity) => {
  try {
    const existCart = await cartDao.getCartById(idCart);
    if (!existCart) {
      console.log("Carrito no encontrado");
      return null;
    }

    const existProdInCart = await cartDao.existProdInCart(idCart, idProd);
    if (!existProdInCart) {
      console.log("Producto no encontrado en el carrito", existProdInCart);
      return null;
    }

    console.log(
      `Actualizando producto ${idProd} en carrito ${idCart} con cantidad ${quantity}`
    );
    return await cartDao.updateProdQuantity(idCart, idProd, quantity);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const clearCart = async (idCart) => {
  try {
    const existCart = await cartDao.getCartById(idCart);
    if (!existCart) {
      return null;
    }
    return await cartDao.clearCart(idCart);
  } catch (error) {
    throw new Error(error);
  }
};

export const viewCart = async (idCart) => {
  try {
    const cart = await cartDao.getCartById(idCart);
    if (!cart) {
      return null;
    }

    const products = cart.products || [];
    const totalQuantity = products.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalPrice = products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    return {
      totalQuantity,
      totalPrice,
      products,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const purchaseCart = async (idCart, userEmail) => {
    try {
      const purchaseResult = await cartDao.purchaseCart(idCart, userEmail);
      if (purchaseResult.completed) {
        const { ticket } = purchaseResult;
        const cart = await cartDao.getCartById(idCart);
        const products = cart.products.map(item => ({
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
        }));
  
        await sendPurchaseEmail(userEmail, ticket, products);
  
        return { message: 'Compra finalizada', ticket };
      }
      return {
        message: "Compra parcial",
        failedProducts: purchaseResult.failedProducts,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };