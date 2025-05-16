import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, category, status, sort } = req.query;

  let filters = {};
  if (category) filters.category = category;
  if (status) filters.status = status === 'true';

  let sortOptions = {};
  if (sort) sortOptions = { price: sort === 'asc' ? 1 : -1 };

  const result = await productManager.getProducts(
    parseInt(limit),
    parseInt(page),
    filters,
    sortOptions
  );

  res.status(200).json(result);
});

export default router;
