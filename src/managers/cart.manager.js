import { __dirname } from "../path.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import ProductManager from "./product.manager.js";
const productManager = new ProductManager(`${__dirname}/data/products.json`)

export default class CartManager {
	constructor(path) {
		this.path = path;
	}

	async getAllCarts() {
		try {
			if (fs.existsSync(this.path)) {
				const carts = await fs.promises.readFile(this.path, "utf8");
				const cartsJSON = JSON.parse(carts);
				return cartsJSON;
			} else {
				return [];
			}
		} catch (error) {
			console.log(error);
		}
	}

	async createCart() {
		try {
			const cart = {
				id: uuidv4(),
				products: [],
			}
			const carts = await this.getAllCarts();
			carts.push(cart);
			await fs.promises.writeFile(this.path, JSON.stringify(carts));
			return cart;
		} catch (error) {
			console.log(error);
		}
	}

	async getCartById(id) {
		try {
			const carts = await this.getAllCarts();
			const cart = carts.find((c) => c.id === id);
			if (!cart) return null;
			return cart;
		} catch (error) {
			console.log(error);
		}
	}

	async addToCart(idCart, idProd) {
		try {
			const prodExists = await productManager.getProductsById(idProd);
			if (!prodExists) {
				throw new Error("PRODUCTO NO ENCONTRADO")
			}

			let carts = await this.getAllCarts();
			const cartExists = await this.getCartById(idCart);
			if (!cartExists) {
				throw new Error("CARRITO NO ENCONTRADO");
			}

			const prodInCart = cartExists.products.find(product => product.product === idProd);

			if (!prodInCart) {
				const productCart = {
					product: idProd,
					quantity: 1
				}
				cartExists.products.push(productCart)
			} else {
				prodInCart.quantity++;
			}

			const updateCart = carts.map((cart) => {
				if (cart.id === idCart) return cartExists;
				else return cart
			})

			await fs.promises.writeFile(this.path, JSON.stringify(updateCart));
			return cartExists

		} catch (err) {
			console.log(err);
		}
	}
}