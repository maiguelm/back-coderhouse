import { Router } from 'express';
import { productsValidator } from '../middlewares/productsValidator.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import * as productsControllers from '../controllers/products.controllers.js';

const router = Router();

router.get('/', productsControllers.getAllProducts);

router.get("/:idProd", productsControllers.getProductById);

router.get("/title/:title", productsControllers.getProductByTitle);

router.get("/code/:code", productsControllers.getProductByCode);

router.get("/category/:category", productsControllers.getProductByCategory);

router.post('/', productsValidator, productsControllers.createProduct);

router.put("/:idProd", productsValidator, productsControllers.updateProduct);

router.delete("/:idProd", productsControllers.deleteProduct);

router.use(errorHandler);

export default router;
