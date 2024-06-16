import { Router } from 'express';
import { loadProductsIndex } from '../server.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const loadedProducts = await loadProductsIndex();
    res.render('home', { products: loadedProducts });
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;