import express from 'express';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';

const app = express();
const PORT = 8080;

app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();


// Rutas para productos

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json(products);
});

// Obtener un producto por ID
app.get('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
app.post('/api/products', async (req, res) => {
  const productData = req.body;
  const newProduct = await productManager.addProduct(productData);
  res.status(201).json({ newProduct, message: "Producto creado" });
});

// Actualizar un producto por ID
app.put('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;
  const updatedProduct = await productManager.updateProductById(pid, updatedData);
  if (updatedProduct) {
    res.status(200).json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto por ID
app.delete('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const result = await productManager.deleteProductById(pid);
  if (result) {
    res.status(200).json({ result, message: "Producto Eliminado" });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});


//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//


// Rutas para carritos

// Crear un nuevo carrito vacío
app.post('/api/carts', async (req, res) => {
  const newCart = await cartManager.addCart();
  res.status(201).json(newCart);
});

// Obtener los productos en un carrito
app.get('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = await cartManager.getProductsInCartById(cid);
  if (products === null) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  } else {
    res.status(200).json({ products, message: "Lista de productos" });
  }
});

// Agregar un producto al carrito
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const updatedCart = await cartManager.addProductInCart(cid, pid, quantity);
  if (updatedCart === null) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  } else {
    res.status(200).json({ updatedCart, message: "Nuevo producto añadido" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});