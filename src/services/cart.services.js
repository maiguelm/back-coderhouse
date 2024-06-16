import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongoDB();

import ProductDaoMongoDB from "../daos/mongodb/products.dao.js";
const productDao = new ProductDaoMongoDB();

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

export const getCartById = async (id) => {
    try {
        return await cartDao.getCartById(id);
    } catch (error) {
        throw new Error(error);
    }
};

export const addToCart = async (idCart, idProd) => {
    try {
        const cart = await cartDao.getCartById(idCart);
        if (!cart) {
            return null;
        }

        const product = await productDao.getProductById(idProd);
        if (!product) {
            return null;
        }

        return await cartDao.addToCart(idCart, idProd);
    } catch (error) {
        throw new Error(error);
    }
};

export const removeFromCart = async (idCart, idProd) => {
    try {
        const existCart = await cartDao.getCartById(idCart);
        if (!existCart) return null;

        const existProd = await cartDao.existProdInCart(idCart, idProd);
        if(!existProd) return null;

        return await cartDao.removeFromCart(idCart, idProd);
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteCart = async (idCart) => {
    try {
        const cartToDelete = await cartDao.deleteCart(idCart)
        console.log(cartToDelete)
        if (!cartToDelete) {
            return false;
        }
        else return cartToDelete;
    } catch (error) {
        throw new Error(error);
    }
}

export const updateCart = async (idCart, products) => {
    try {
        const existCart = await cartDao.getCartById(idCart);
        if (!existCart) {
            console.log("Carrito no encontrado");
            return null;
        }

        for (const product of products) {
            const existProd = await productDao.getProductById(product.product);
            if (!existProd) {
                console.log(`Producto con ID ${product.product} no encontrado`);
                return null;
            }
        }
        return await cartDao.updateCart(idCart, products);
    } catch (error) {
        throw new Error(error);
    }
}

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

        console.log(`Actualizando producto ${idProd} en carrito ${idCart} con cantidad ${quantity}`);
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
}