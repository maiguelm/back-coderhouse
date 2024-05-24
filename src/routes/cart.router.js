import { Router } from "express";
const router = Router();

import { __dirname } from "../utils/path.js";
import CartManager from "../managers/cart.manager.js";
const cartManager = new CartManager(`${__dirname}/../data/carts.json`);

router.post("/", async (rq, res) => {
	try {
		res.json(await cartManager.createCart());
	} catch (err) {
		res.status(400).json(err.message);
	}
});

router.get("/:idCart", async (req, res) => {
	try {
		const { idCart } = req.params;
		res.json(await cartManager.getCartById(idCart));
	} catch (error) {
		console.log(error);
	}
});

router.post("/:idCart/product/:idProd", async (req, res, next) => {
	try {
		const { idProd } = req.params;
		const { idCart } = req.params;
		const response = await cartManager.addToCart(idCart, idProd);
		res.json(response);
	} catch (error) {
		next(error);
	}
});

export default router;
