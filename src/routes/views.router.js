import { Router } from 'express';
import * as productsServices from '../services/products.services.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
      const limit = req.query.limit || 15;
      const response = await productsServices.getAllProducts(limit);
      const products = response.docs;
      res.render('home', { products });
  } catch (error) {
      console.error('Error al cargar los productos:', error);
      res.status(500).send('Error al cargar los productos');
  }
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});


export default router;