import mongoose from "mongoose";
import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongoDB {

    async getAllCarts() {
        try {
            return await CartModel.find().lean();
        } catch (error) {
            throw new Error(error);
        }
    }

    async createCart() {
        try {
            const cart = await CartModel.create({ products: [] });
            return cart;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCartById(id) {
        try {
            return await CartModel.findById(id).lean().populate("products.product");
        } catch (error) {
            throw new Error(error);
        }
    }

    async existProdInCart(idCart, idProd){
        try {
            return await CartModel.findOne({
                _id: idCart,
                products: { $elemMatch: { product: idProd } }
            })
        } catch (error) {
            throw new Error(error);
        }
    }

/*     async addToCart(idCart, idProd) {
        try {
            const existInCart = await this.existProdInCart(idCart, idProd);
                if(existInCart) {
                    return await CartModel.findOneAndUpdate(
                        {_id: idCart, 'products.product': idProd},
                        { $set: { 'products.$.quantity': existInCart.products[0].quantity + 1 } },
                        { new: true }
                    )
                } else {
                    return await CartModel.findByIdAndUpdate(
                      idCart,
                      { $push: { products: { product: idProd } } },
                      { new: true }
                )}

        } catch (error) {
            throw new Error(error);
        }
    } */ //No logré hacerlo funcionar correctamente

    async addToCart(idCart, idProd) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const productInCart = cart.products.find(item => item.product.toString() === idProd);
            if (productInCart) {
                productInCart.quantity += 1;
                await cart.save();
                return cart;
            } else {
                cart.products.push({ product: idProd, quantity: 1 });
                await cart.save();
                return cart;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async removeFromCart(idCart, idProd) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(
                idCart,
                { $pull: { products: { product: idProd } } },
                { new: true }
            );

            if (!updatedCart) {
                throw new Error("Carrito no encontrado");
            }

            return updatedCart;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteCart(id) {
        try {
            return await CartModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCart(idCart, products) {
        try {
            const cart = await CartModel.findById(idCart);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            for (const prod of products) {
                const productIndex = cart.products.findIndex(item => item.product.toString() === prod.product);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = prod.quantity;
                } else {
                    cart.products.push(prod);
                }
            }

            const response = await cart.save();
            return response;
        } catch (error) {
          throw new Error(error);
        }
      }

      async updateProdQuantity(idCart, idProd, quantity) {
        try {
            const response = await CartModel.findOneAndUpdate(
                { _id: idCart, 'products.product': idProd },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            );
          return response;
        } catch (error) {
          throw new Error(error);
        }
      }

      async clearCart(idCart) {
        try {
            return await CartModel.findByIdAndUpdate(
                { _id: idCart },
                { $set: { products:[] } },
                { new: true }
            )
        } catch (error) {
            throw new Error(error);
        }
      }
}