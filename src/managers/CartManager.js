import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartManager {
  // Crear un nuevo carrito vacío
  addCart = async () => {
    const newCart = new Cart();
    await newCart.save();
    return newCart;
  }

  // Obtener los productos de un carrito por su ID
  getProductsInCartById = async (cid) => {
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return null;
    return cart.products;
  }

  // Agregar un producto a un carrito
  addProductInCart = async (cid, pid, quantity) => {
    const product = await Product.findById(pid);
    if (!product) return null;

    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return cart;
  }

  // Eliminar un producto de un carrito
  deleteProductInCart = async (cid, pid) => {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(item => item.product.toString() !== pid);
    await cart.save();
    return cart;
  }

  // Eliminar todos los productos de un carrito
  clearCart = async (cid) => {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default CartManager;
