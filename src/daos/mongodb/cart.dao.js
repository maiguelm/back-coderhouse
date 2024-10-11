import mongoose from "mongoose";
import { CartModel } from "./models/cart.model.js";
import ProductDaoMongoDB from "./products.dao.js";
import Ticket from "./models/ticket.model.js"

export default class CartDaoMongoDB {

    constructor() {
        this.productDao = new ProductDaoMongoDB();
    }

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

    async addToCart(idCart, idProd) {
        try {
            const existInCart = await this.existProdInCart(idCart, idProd);
    
            if (existInCart) {
                return await CartModel.findOneAndUpdate(
                    { _id: idCart, 'products.product': idProd },
                    { $inc: { 'products.$.quantity': 1 } },
                    { new: true }
                );
            } else {
                return await CartModel.findByIdAndUpdate(
                    idCart,
                    { $push: { products: { product: idProd, quantity: 1 } } },
                    { new: true }
                );
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

      async purchaseCart(idCart, userEmail) {
        try {
            const cart = await this.getCartById(idCart);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            let totalAmount = 0;
            const failedProducts = [];

            // Iterar sobre los productos en el carrito
            for (const item of cart.products) {
                const product = await this.productDao.getProductById(item.product); // Usa this.productDao
                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    totalAmount += product.price * item.quantity;
                    await product.save();
                } else {
                    failedProducts.push({
                        product: item.product,
                        requestedQuantity: item.quantity,
                        availableStock: product ? product.stock : 0,
                    });
                }
            }

            // Si hay productos fallidos, devolver compra parcial
            if (failedProducts.length > 0) {
                return { completed: false, failedProducts };
            }

            // Si la compra fue exitosa, generar un ticket
            const generateTicketCode = () => {
                return Math.random().toString(36).substr(2, 9).toUpperCase(); // Genera un código alfanumérico de 9 caracteres
            };
            const ticket = await Ticket.create({
                purchaser: userEmail,
                amount: totalAmount,
                purchaseDate: new Date(),
                code: generateTicketCode()
            });

            // Limpiar el carrito después de la compra
            await this.clearCart(idCart);

            return { completed: true, ticket };
        } catch (error) {
            throw new Error(error.message);
        }
    }

}