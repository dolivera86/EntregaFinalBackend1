import ProductManager from '../managers/ProductManager.js';

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  const { limit, page, category, status, sort } = req.query;
  try {
    const result = await productManager.getProducts(limit, page, category, status, sort);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

export const createProduct = async (req, res) => {
  const { title, price, stock, category, description, thumbnails, code, status } = req.body;
  try {
    const newProduct = await productManager.createProduct({ title, price, stock, category, description, thumbnails, code, status });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};
