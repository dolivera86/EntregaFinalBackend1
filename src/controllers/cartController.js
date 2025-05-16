import CartManager from '../managers/CartManager.js';

const cartManager = new CartManager();

export const getCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartManager.getCart(cartId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

export const addToCart = async (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;
  try {
    const updatedCart = await cartManager.addToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};
