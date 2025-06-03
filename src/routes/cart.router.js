import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

// Eliminar producto de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const updatedCart = await cartManager.deleteProductInCart(cid, pid);
  if (!updatedCart) {
    return res.status(404).json({ error: 'Carrito no encontrado o producto no existe' });
  }
  res.status(200).json(updatedCart);
});

// Vaciar todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  const updatedCart = await cartManager.clearCart(cid);
  if (!updatedCart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  res.status(200).json(updatedCart);
});

export default router;
