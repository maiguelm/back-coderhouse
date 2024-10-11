import passport from 'passport';
import { Router } from 'express';
import * as cartControllers from "../controllers/cart.controllers.js";
import { isUser } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', cartControllers.getAllCarts);
router.get('/:idCart', cartControllers.getCartById);
router.get('/:idCart/view', cartControllers.viewCart);
router.post('/', cartControllers.createCart);
router.post('/:idCart/product/:idProd', cartControllers.addToCart);
router.put('/:idCart', cartControllers.updateCart);
router.put('/:idCart/product/:idProd', cartControllers.updateProdQuantity);
router.delete('/:idCart/product/:idProd', cartControllers.removeFromCart);
router.delete('/:idCart', cartControllers.deleteCart);
router.delete('/:idCart/clear', cartControllers.clearCart);
router.post('/:idCart/purchase',passport.authenticate('jwt', { session: false }), // Verifica que el usuario esté autenticado con JWT
isUser, cartControllers.purchaseCart);

export default router;