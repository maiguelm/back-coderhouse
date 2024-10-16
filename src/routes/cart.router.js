import passport from 'passport';
import { Router } from 'express';
import * as cartControllers from "../controllers/cart.controllers.js";
import { isAdmin, isUser } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', cartControllers.getAllCarts);
router.get('/:idCart', cartControllers.getCartById);
router.get('/:idCart/view', cartControllers.viewCart);
router.post('/', cartControllers.createCart);
router.post('/:idCart/product/:idProd',passport.authenticate('jwt', { session: false }), isUser, cartControllers.addToCart);
router.put('/:idCart', cartControllers.updateCart);
router.put('/:idCart/product/:idProd', cartControllers.updateProdQuantity);
router.delete('/:idCart/product/:idProd', cartControllers.removeFromCart);
router.delete('/:idCart', cartControllers.deleteCart);
router.delete('/:idCart/clear', cartControllers.clearCart);
router.post('/:idCart/purchase',passport.authenticate('jwt', { session: false }),
isUser, cartControllers.purchaseCart);

export default router;