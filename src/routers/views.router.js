import { Router } from 'express';

const router = Router();

export default (productManager, io) => {
  router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
  });

  router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  });

  return router;
};