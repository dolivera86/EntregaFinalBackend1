import fs from 'fs';
import path from 'path';

const productsFile = path.join('src', 'data', 'products.json');

class ProductManager {
  constructor() {
    this.path = productsFile;
  }

  // Obtener todos los productos
  getProducts = async () => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    return JSON.parse(productsJson);
  }

  // Obtener un producto por su ID
  getProductById = async (id) => {
    const products = await this.getProducts();
    return products.find(product => product.id === parseInt(id));
  }

  // Agregar un nuevo producto
  addProduct = async (productData) => {
    const products = await this.getProducts();
    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...productData };
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    return newProduct;
  }

  // Actualizar un producto por su ID
  updateProductById = async (id, updatedData) => {
    const products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === parseInt(id));
    if (productIndex === -1) return null;
    products[productIndex] = { ...products[productIndex], ...updatedData };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    return products[productIndex];
  }

  // Eliminar un producto por su ID
  deleteProductById = async (id) => {
    const products = await this.getProducts();
    const updatedProducts = products.filter(product => product.id !== parseInt(id));
    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 2), 'utf-8');
    return true;
  }
}

export default ProductManager;