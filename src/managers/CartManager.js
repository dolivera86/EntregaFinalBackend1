import fs from 'fs';
import path from 'path';

const cartsFile = path.join('src', 'data', 'carts.json');

class CartManager {
  constructor() {
    this.path = cartsFile;
  }

  // Generar un nuevo ID para los carritos
  generateNewId = (carts) => {
    if (carts.length > 0) {
      return carts[carts.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  // Crear un nuevo carrito vacío
  addCart = async () => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);
    const id = this.generateNewId(carts);
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    return newCart;
  }

  // Obtener los productos de un carrito por su ID
  getProductsInCartById = async (cid) => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);
    const cart = carts.find(cart => cart.id === parseInt(cid));
    if (!cart) return null;
    return cart.products;
  }

  // Agregar un producto a un carrito
  addProductInCart = async (cid, pid, quantity) => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);

    // Buscamos el carrito por su id
    const cart = carts.find(cart => cart.id === parseInt(cid));

    // Si no encuentra el carrito devuelve null
    if (!cart) return null;

    // Buscar si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(product => product.id === parseInt(pid));
    if (existingProductIndex !== -1) {

      // Si existe, sumar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {

      // Si no existe, agregarlo como un nuevo producto
      cart.products.push({ id: parseInt(pid), quantity });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

    // Carrito actualizado
    return cart;
  }
}

export default CartManager;