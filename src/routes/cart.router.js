import { Router } from 'express';
import * as cartControllers from "../controllers/cart.controllers.js";

const router = Router();

router.get('/', cartControllers.getAllCarts);
router.get('/:id', cartControllers.getCartById);
router.post('/', cartControllers.createCart);
router.post('/:idCart/product/:idProd', cartControllers.addToCart);
router.put('/:id', cartControllers.updateCart);
router.put("/:idCart/products/:idProd", cartControllers.updateProdQuantity);
router.delete('/:idCart/product/:idProd', cartControllers.removeFromCart);
router.delete("/:idCart", cartControllers.deleteCart);
router.delete('/clear/:idCart', cartControllers.clearCart);

export default router;


