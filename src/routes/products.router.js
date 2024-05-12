import { Router } from 'express';
const router = Router();
import { __dirname } from '../path.js';
import ProductManager from '../managers/product.manager.js';
const productManager = new ProductManager(`${__dirname}/data/products.json`);

import { productsValidator } from '../middlewares/productsValidator.js'

router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    // console.log(limit)
    const products = await productManager.getProducts(limit);
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
});

router.get("/:idProd", async (req, res) => {
  try {
    const { idProd } = req.params;
    const product = await productManager.getProductsById(idProd);
    if (!product) res.status(404).json({ msg: "Productgo no encontrado" });
    else res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


router.post('/', productsValidator, async (req, res) => {
  try {
    console.log(req.body);
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res.json(newProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put("/:idProd", async (req, res) => {
  try {
    const { idProd } = req.params;
    const prodUpd = await productManager.updateProduct(req.body, idProd);
    console.log(prodUpd)

    if (!prodUpd) {
      return res.status(404).json({ msg: "No se pudo actualizar el producto" });
    }

    return res.status(200).json(prodUpd);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.delete("/:idProd", async (req, res) => {
  try {
    const { idProd } = req.params;
    const delProd = await productManager.deleteProduct(idProd);
    if (!delProd) res.status(404).json({ msg: "Hay un error en el producto" });
    else res.status(200).json({ msg: `El producto id: ${idProd} se eliminó exitosamente` })
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await productManager.deleteData();
    res.send('Los datos han sido eliminados')
  } catch (error) {
    res.status(404).json({ message: error.message });

  }
});


export default router