import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

// Importamos los managers para manejar productos y carritos
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import viewsRouter from './routers/views.router.js';

// Configuración para obtener __dirname usando ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializamos express
const app = express();
const PORT = 8080;

// Inicializamos el servidor y socket.io
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Middlewares para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Instanciamos los managers
const productManager = new ProductManager();
const cartManager = new CartManager();

// Rutas para las vistas (Home y RealTimeProducts)
app.use('/', viewsRouter(productManager, io));


//---------------------------------------------------------------------//
//---------------------- RUTAS API DE PRODUCTOS -----------------------//
//---------------------------------------------------------------------//

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json(products);
});

// Obtener un producto por su ID
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
//---------------------- RUTAS API DE CARRITOS ------------------------//
//---------------------------------------------------------------------//

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


//---------------------------------------------------------------------//
//------------------------ WEBSOCKETS CONFIG --------------------------//
//---------------------------------------------------------------------//

// WebSocket para conexión en tiempo real
io.on('connection', async socket => {
  console.log('Cliente conectado');

  // Enviar la lista inicial de productos al cliente conectado
  socket.emit('productListUpdate', await productManager.getProducts());

  // Escuchar cuando se crea un nuevo producto desde el cliente
  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);

    // Emitimos a todos los clientes la nueva lista actualizada
    io.emit('productListUpdate', await productManager.getProducts());
  });

  // Escuchar cuando se elimina un producto desde el cliente
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProductById(id);

    // Emitimos nuevamente la lista actualizada
    io.emit('productListUpdate', await productManager.getProducts());
  });
});