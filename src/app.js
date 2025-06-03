import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/product.router.js';
import cartRoutes from './routes/cart.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config(); // Cargar las variables de entorno
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
connectDB(); // Conectar con la base de datos

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

const productManager = new ProductManager();


app.get('/', async (req, res) => {
  const result = await productManager.getProducts();
  res.render('home', {
    products: result.payload,
    prevLink: result.prevLink,
    nextLink: result.nextLink,
  });
});

app.get('/realtimeproducts', async (req, res) => {
  const result = await productManager.getProducts();
  res.render('realTimeProducts', { products: result.payload });
});

io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  // Enviar productos actuales al conectar
  const result = await productManager.getProducts();
  socket.emit('productListUpdate', result.payload);

  // Crear producto
  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const updated = await productManager.getProducts();
    io.emit('productListUpdate', updated.payload);
  });

  // Eliminar producto
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProductById(id);
    const updated = await productManager.getProducts();
    io.emit('productListUpdate', updated.payload);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
